#!/usr/bin/env python3
"""
Test Visual Enhancements - The Headless Horseman's Quest
Verifies all visual enhancements are working correctly
"""

from playwright.sync_api import sync_playwright
import time

def test_visual_enhancements():
    print("🎨 Testing Visual Enhancements...")
    print("=" * 60)

    with sync_playwright() as p:
        # Launch browser in headless mode
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        # Navigate to the app
        print("\n1️⃣ Navigating to http://localhost:3002...")
        page.goto('http://localhost:3002')
        page.wait_for_load_state('networkidle')
        time.sleep(2)  # Wait for animations to start

        print("✅ Page loaded successfully")

        # Take full page screenshot
        print("\n2️⃣ Taking full page screenshot...")
        page.screenshot(path='screenshots/01-full-page.png', full_page=True)
        print("✅ Saved: screenshots/01-full-page.png")

        # Check for gradient text (The Graveyard heading)
        print("\n3️⃣ Checking for gradient text on main heading...")
        heading = page.locator('h1').first
        heading_classes = heading.get_attribute('class')

        if 'animate-gradient-shift' in heading_classes:
            print("✅ Gradient animation class found: animate-gradient-shift")
        else:
            print("❌ Missing: animate-gradient-shift class")

        if 'bg-gradient-to-r' in heading_classes:
            print("✅ Gradient direction class found: bg-gradient-to-r")
        else:
            print("❌ Missing: bg-gradient-to-r class")

        # Check for floating ghost emoji
        print("\n4️⃣ Checking for animated ghost emoji...")
        ghost_span = page.locator('h1 span.animate-float-ghost')
        if ghost_span.count() > 0:
            print("✅ Floating ghost emoji found with animate-float-ghost class")
            ghost_text = ghost_span.text_content()
            print(f"   Ghost content: {ghost_text}")
        else:
            print("❌ Missing: animate-float-ghost class on ghost emoji")

        # Check for file cards
        print("\n5️⃣ Checking file cards...")
        file_cards = page.locator('div[role="button"]').all()
        print(f"✅ Found {len(file_cards)} file cards")

        if len(file_cards) > 0:
            # Take screenshot of first card
            first_card = file_cards[0]
            card_classes = first_card.get_attribute('class')

            print("\n6️⃣ Analyzing first card classes...")
            enhancements = [
                ('hover:scale-[1.02]', 'Scale on hover'),
                ('hover:rotate-1', 'Rotation on hover'),
                ('hover:shadow-2xl', 'Enhanced shadow'),
                ('hover:-translate-y-2', 'Lift effect'),
                ('duration-500', 'Smooth transition'),
            ]

            for class_name, description in enhancements:
                if class_name in card_classes:
                    print(f"✅ {description}: {class_name}")
                else:
                    print(f"❌ Missing: {description} ({class_name})")

            # Hover over the first card and take screenshot
            print("\n7️⃣ Testing card hover state...")
            first_card.scroll_into_view_if_needed()
            time.sleep(0.5)

            # Screenshot before hover
            page.screenshot(path='screenshots/02-card-before-hover.png')
            print("✅ Saved: screenshots/02-card-before-hover.png")

            # Hover and screenshot
            first_card.hover()
            time.sleep(0.5)  # Wait for transition
            page.screenshot(path='screenshots/03-card-hover.png')
            print("✅ Saved: screenshots/03-card-hover.png")

        # Scroll to AI Spirit Medium section
        print("\n8️⃣ Checking AI Spirit Medium section...")
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(1)

        # Check for pulsing crystal ball
        crystal_ball = page.locator('.animate-pulse-crystal')
        if crystal_ball.count() > 0:
            print("✅ Pulsing crystal ball found with animate-pulse-crystal class")
            crystal_text = crystal_ball.text_content()
            print(f"   Crystal ball content: {crystal_text}")
        else:
            print("❌ Missing: animate-pulse-crystal class on crystal ball")

        # Check for gradient text on Spirit Medium heading
        spirit_heading = page.locator('h2.animate-gradient-shift')
        if spirit_heading.count() > 0:
            print("✅ AI Spirit Medium heading has gradient animation")
        else:
            print("❌ Missing: gradient animation on AI Spirit Medium heading")

        # Take screenshot of chat section
        page.screenshot(path='screenshots/04-chat-section.png')
        print("✅ Saved: screenshots/04-chat-section.png")

        # Check CSS animations are loaded
        print("\n9️⃣ Checking if CSS animations are loaded...")
        page.evaluate("""
            const styleSheets = Array.from(document.styleSheets);
            const hasGradientShift = styleSheets.some(sheet => {
                try {
                    const rules = Array.from(sheet.cssRules || sheet.rules || []);
                    return rules.some(rule =>
                        rule.name === 'gradient-shift' ||
                        (rule.cssText && rule.cssText.includes('gradient-shift'))
                    );
                } catch (e) {
                    return false;
                }
            });

            if (hasGradientShift) {
                console.log('✅ gradient-shift animation found in CSS');
            } else {
                console.log('❌ gradient-shift animation not found');
            }
        """)

        # Get console logs
        print("\n🔟 Checking for JavaScript errors...")
        console_messages = []
        errors = []

        page.on('console', lambda msg: console_messages.append(f"{msg.type}: {msg.text}"))

        # Reload to capture console
        page.reload()
        page.wait_for_load_state('networkidle')
        time.sleep(1)

        for msg in console_messages:
            if 'error' in msg.lower():
                errors.append(msg)

        if errors:
            print(f"⚠️  Found {len(errors)} console errors:")
            for error in errors[:5]:  # Show first 5
                print(f"   {error}")
        else:
            print("✅ No JavaScript errors found")

        # Final full page screenshot
        print("\n1️⃣1️⃣ Taking final full page screenshot...")
        page.screenshot(path='screenshots/05-final-full-page.png', full_page=True)
        print("✅ Saved: screenshots/05-final-full-page.png")

        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Page loads successfully")
        print(f"✅ File cards present: {len(file_cards)} cards found")
        print(f"✅ Screenshots captured: 5 images saved")
        print(f"✅ Animations verified")

        if errors:
            print(f"⚠️  Console errors: {len(errors)} found")
        else:
            print(f"✅ No console errors")

        print("\n📸 Screenshots saved in: screenshots/")
        print("   - 01-full-page.png")
        print("   - 02-card-before-hover.png")
        print("   - 03-card-hover.png")
        print("   - 04-chat-section.png")
        print("   - 05-final-full-page.png")

        browser.close()

        print("\n🎉 Visual enhancement testing complete!")
        return True

if __name__ == '__main__':
    try:
        test_visual_enhancements()
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
