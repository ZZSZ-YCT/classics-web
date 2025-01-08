// noinspection JSFileReferences

import MarkdownIt from 'markdown-it'
import MarkdownItKatex from '@vscode/markdown-it-katex'
import MarkdownItImSize from 'markdown-it-imsize/dist/markdown-it-imsize.js'

const md = new MarkdownIt()
    .use(MarkdownItKatex)
    .use(MarkdownItImSize)

export function md_render(text) {
    return md.render(text)
}