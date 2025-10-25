#!/usr/bin/env python3
"""
Generate Headless Horseman themed images for VibeGames
Uses Gemini 2.5 Flash via OpenRouter API
"""

import sys
sys.path.append('/tmp/CLI-Gemini-image-generator-SDK')

from gemini_image_sdk import ImageGenerator, Config

def main():
    print("🎃 Generating Headless Horseman themed images...\n")

    # Configure SDK
    config = Config.from_env('/tmp/CLI-Gemini-image-generator-SDK/.env')
    config.output.base_dir = './public/generated'
    config.output.width = 1920
    config.output.height = 1080
    config.output.quality = 95

    generator = ImageGenerator(config)

    # Define themed images to generate
    images = [
        {
            "prompt": "A dramatic headless horseman silhouette riding a spectral glowing horse through a misty digital graveyard at midnight, floating glowing pumpkin head above shoulders, scattered markdown files with orange glow floating in the mist, cinematic wide shot, dark fantasy atmosphere, orange and purple color palette, volumetric fog, 4k quality",
            "filename": "hero-background.webp",
            "description": "Hero section background"
        },
        {
            "prompt": "Minimalist headless horseman logo design, glowing jack-o-lantern pumpkin head floating above a dark silhouette, clean vector style, orange and purple gradient glow effect, transparent background, professional modern design",
            "filename": "logo-variant.webp",
            "description": "Logo variant"
        },
        {
            "prompt": "Top-down aerial view of a mystical digital graveyard map, ancient tombstones with glowing code symbols etched in stone, folder names on graves, ethereal purple mist flowing between tombstones, moonlight casting orange highlights, fantasy game map style, isometric perspective",
            "filename": "graveyard-map.webp",
            "description": "Graveyard map visualization"
        },
        {
            "prompt": "Large glowing crystal ball with purple mystic energy swirling inside, AI symbols and code flowing within the sphere, headless horseman's ghostly reflection visible in the crystal surface, dark atmospheric background, magical particles floating around, cinematic lighting",
            "filename": "ai-medium-crystal.webp",
            "description": "AI Spirit Medium visual"
        },
        {
            "prompt": "Floating spectral markdown document cards in a dark graveyard setting, orange glowing edges on papers, code text visible on pages, ethereal mist around cards, dark fantasy illustration style, purple and orange accent lighting, depth of field blur",
            "filename": "file-cards-bg.webp",
            "description": "File cards background"
        },
        {
            "prompt": "Headless horseman on spectral horse galloping through streams of glowing code and text fragments, ethereal trail of orange light behind the horse, digital particles and markdown symbols swirling in the air, cyberpunk meets dark fantasy, dynamic action shot",
            "filename": "feature-background.webp",
            "description": "Feature section background"
        }
    ]

    print(f"📋 Generating {len(images)} images...\n")

    # Generate each image
    results = []
    for i, img in enumerate(images, 1):
        print(f"[{i}/{len(images)}] {img['description']}...")
        print(f"    Prompt: {img['prompt'][:80]}...")

        result = generator.generate(
            prompt=img['prompt'],
            filename=img['filename']
        )

        results.append({
            'result': result,
            'description': img['description'],
            'filename': img['filename']
        })

        if result.success:
            print(f"    ✅ Generated: {result.path} ({result.duration_ms}ms)")
        else:
            print(f"    ❌ Failed: {result.error}")

        print()

    # Summary
    print("\n" + "="*60)
    print("📊 Generation Summary")
    print("="*60)

    successful = sum(1 for r in results if r['result'].success)
    failed = len(results) - successful

    print(f"\n✅ Successful: {successful}/{len(results)}")
    print(f"❌ Failed: {failed}/{len(results)}\n")

    if successful > 0:
        print("Generated images:")
        for r in results:
            if r['result'].success:
                print(f"  • {r['description']}: {r['result'].path}")

    if failed > 0:
        print("\nFailed images:")
        for r in results:
            if not r['result'].success:
                print(f"  • {r['description']}: {r['result'].error}")

    print("\n✨ Image generation complete!")
    print(f"📁 Images saved to: ./public/generated/")

if __name__ == "__main__":
    main()
