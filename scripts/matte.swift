// Lifts Adenike off the studio background, frame by frame, using the same Vision
// request Preview's "Remove Background" uses. It keeps a real soft edge — the loose
// curls survive as partial alpha, which a chroma key would clip to a hard outline.
//
// Built on demand by scripts/build-video.mjs; the binary lives in scratch/ and is
// never checked in. One process handles the whole sequence: the model load costs
// more than the matting does.
//
//   swiftc -O scripts/matte.swift -o scratch/matte
//   scratch/matte <in-dir> <out-dir>

import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else {
    fputs("usage: matte <in-dir> <out-dir>\n", stderr)
    exit(2)
}
let inDir = URL(fileURLWithPath: args[1])
let outDir = URL(fileURLWithPath: args[2])
try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

// Software rendering would be many times slower over a whole sequence.
let ctx = CIContext(options: [.useSoftwareRenderer: false])

func matte(_ src: URL, to dst: URL) -> Bool {
    guard let img = CIImage(contentsOf: src) else { return false }
    let handler = VNImageRequestHandler(ciImage: img, options: [:])
    let req = VNGenerateForegroundInstanceMaskRequest()
    do {
        try handler.perform([req])
        guard let obs = req.results?.first else { return false }
        // croppedToInstancesExtent stays false so every frame keeps the source
        // geometry — the sequence is cropped later, once, to a shared box.
        let buf = try obs.generateMaskedImage(ofInstances: obs.allInstances,
                                              from: handler,
                                              croppedToInstancesExtent: false)
        let out = CIImage(cvPixelBuffer: buf)
        guard let cg = ctx.createCGImage(out, from: out.extent) else { return false }
        guard let data = NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:])
        else { return false }
        try data.write(to: dst)
        return true
    } catch {
        return false
    }
}

let frames = (try? FileManager.default.contentsOfDirectory(at: inDir, includingPropertiesForKeys: nil))?
    .filter { $0.pathExtension.lowercased() == "png" }
    .sorted { $0.lastPathComponent < $1.lastPathComponent } ?? []

var done = 0, missed: [String] = []
for f in frames {
    if matte(f, to: outDir.appendingPathComponent(f.lastPathComponent)) {
        done += 1
    } else {
        missed.append(f.lastPathComponent)
    }
}

print("matted \(done)/\(frames.count)")
if !missed.isEmpty {
    // A frame with no detected subject is a hole in the sequence, not a warning to
    // shrug at — the build decides what to do about it.
    print("no-subject: \(missed.joined(separator: ","))")
}
exit(missed.isEmpty ? 0 : 1)
