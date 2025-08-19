// noinspection JSFileReferences

import MarkdownIt from 'markdown-it'
import MarkdownItKatex from '@vscode/markdown-it-katex'
import MarkdownItImSize from 'markdown-it-imsize/dist/markdown-it-imsize.js'

const md = new MarkdownIt({
    html: true,
    breaks: true,
})
    .use(MarkdownItKatex)
    .use(MarkdownItImSize)

export function md_render(text) {
    let html = md.render(text)
    
    // 修正表格空行问题
    html = html.replace(/<tr>\s*<\/tr>/g, '')
    html = html.replace(/<tr>\s*(<td[^>]*>\s*<\/td>\s*)+<\/tr>/g, (match) => {
        // 检查是否所有的 td 都是空的
        const tdPattern = /<td[^>]*>([^<]*)<\/td>/g
        let hasContent = false
        let tdMatch
        while ((tdMatch = tdPattern.exec(match)) !== null) {
            if (tdMatch[1].trim() !== '') {
                hasContent = true
                break
            }
        }
        return hasContent ? match : ''
    })
    
    return html
}