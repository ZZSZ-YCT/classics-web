// noinspection JSFileReferences

import MarkdownIt from 'markdown-it'
import markdownItKatex from 'markdown-it-katex'
import markdownItImSize from 'markdown-it-imsize/dist/markdown-it-imsize.js' // Thanks https://github.com/tatsy/markdown-it-imsize/issues/8#issuecomment-2122568597

const md = new MarkdownIt()
    .use(markdownItKatex)
    .use(markdownItImSize)

export function md_render(text) {
    return md.render(text)
}