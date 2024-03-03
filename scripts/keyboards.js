import { normalGenerator } from "./lib/utils.js"
import { direct_mixed_keyboard } from "./lib/keyboards/direct-mixed.js"
import { zh_arabic_direct } from "./lib/keyboards/zh-arabic-direct.js"
import { zh_cyrillic_direct } from "./lib/keyboards/zh-cyrillic-direct.js"

try {
    ;[direct_mixed_keyboard, zh_arabic_direct, zh_cyrillic_direct].forEach(
        (r) => {
            normalGenerator(r)
        }
    )
} catch (e) {
    console.error(e)
}
