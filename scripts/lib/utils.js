import fs from "fs"
import path from "path"

const templates_path = path.resolve("templates")
const keyboards_path = path.resolve("keyboards")

/**
 * 键盘混合工具
 * @param {string} raw 原始文件
 * @param {string} prefix 前缀
 * @param {string} name 键盘名称
 * @param {Array} keyboards 组合键盘
 */
export const normalMixer = (raw, prefix, name, keyboards) => {
    if (!Array.isArray(keyboards)) {
        throw new Error("键盘参数不是数组")
    }

    const slots = (raw.split("keyboard-slot").length - 1) / 2

    if (!slots || slots !== keyboards.length) {
        throw new Error(`${name} 键盘参数数量与插槽数量不匹配`)
    }

    let result = raw.replace("name-slot", `${prefix}_${name}`)

    keyboards.forEach((keyboard) => {
        result = result
            .replace("keyboard-slot", `${prefix}_${keyboard.name}`)
            .replace("keyboard-slot-label", keyboard.label)
    })

    return result
}

/**
 * 键盘生成器
 * @param {string} name 方案名称
 * @param {string} filename 文件名称
 * @param {Array} rules
 */
export const normalGenerator = ({ name, filename, rules }) => {
    if (!Array.isArray(rules)) {
        throw new Error("规则参数不是数组")
    }

    // rules 第一个参数为文件路径数组，进行合并操作
    let result =
        "keyboards:\n" +
        rules
            .map((r) => {
                const raw = fs
                    .readFileSync(
                        `${path.join(templates_path, ...r.template)}.yaml`,
                        "utf-8"
                    )
                    .trim()
                    .replace(/keyboards:\n/, "")
                return normalMixer(raw, name, r.name, r.keyboards)
            })
            .join("\n")

    if (!fs.existsSync(keyboards_path)) {
        fs.mkdirSync(keyboards_path)
    }

    fs.writeFileSync(path.join(keyboards_path, `${filename}.yaml`), result)
}
