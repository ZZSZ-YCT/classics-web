<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useDisplay } from 'vuetify'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  required?: boolean
  rules?: Array<(v: string) => string | boolean>
  rows?: number
  maxRows?: number
  hideDetails?: boolean | string
}

const props = withDefaults(defineProps<Props>(), {
  label: '内容',
  placeholder: '支持 Markdown 格式',
  required: false,
  rules: () => [],
  rows: 4,
  maxRows: 10,
  hideDetails: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { mobile } = useDisplay()
const textareaRef = ref<HTMLTextAreaElement>()

const localValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

// 处理键盘事件，实现自动列表续行
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    const textarea = event.target as HTMLTextAreaElement
    const start = textarea.selectionStart
    const value = localValue.value
    
    // 找到当前行的开始位置
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const currentLine = value.substring(lineStart, start)
    
    // 检测无序列表
    const unorderedMatch = currentLine.match(/^(\s*)-\s*(.*)$/)
    if (unorderedMatch) {
      const [, indent, content] = unorderedMatch
      
      // 如果当前行的内容为空，则退出列表模式
      if (!content.trim()) {
        event.preventDefault()
        // 删除当前行的列表标记，只保留换行
        const newValue = value.substring(0, lineStart) + indent.replace(/\s*$/, '') + '\n' + value.substring(start)
        localValue.value = newValue
        nextTick(() => {
          textarea.setSelectionRange(lineStart + indent.replace(/\s*$/, '').length + 1, lineStart + indent.replace(/\s*$/, '').length + 1)
        })
        return
      }
      
      // 继续无序列表
      event.preventDefault()
      const newContent = '\n' + indent + '- '
      const newValue = value.substring(0, start) + newContent + value.substring(start)
      localValue.value = newValue
      nextTick(() => {
        const newPos = start + newContent.length
        textarea.setSelectionRange(newPos, newPos)
      })
      return
    }
    
    // 检测有序列表
    const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s*(.*)$/)
    if (orderedMatch) {
      const [, indent, num, content] = orderedMatch
      
      // 如果当前行的内容为空，则退出列表模式
      if (!content.trim()) {
        event.preventDefault()
        // 删除当前行的列表标记，只保留换行
        const newValue = value.substring(0, lineStart) + indent.replace(/\s*$/, '') + '\n' + value.substring(start)
        localValue.value = newValue
        nextTick(() => {
          textarea.setSelectionRange(lineStart + indent.replace(/\s*$/, '').length + 1, lineStart + indent.replace(/\s*$/, '').length + 1)
        })
        return
      }
      
      // 继续有序列表，数字递增
      event.preventDefault()
      const nextNum = parseInt(num) + 1
      const newContent = '\n' + indent + nextNum + '. '
      const newValue = value.substring(0, start) + newContent + value.substring(start)
      localValue.value = newValue
      nextTick(() => {
        const newPos = start + newContent.length
        textarea.setSelectionRange(newPos, newPos)
      })
      return
    }
  }
}

// 对话框状态
const headingDialog = ref(false)
const linkDialog = ref(false)
const imageDialog = ref(false)
const tableDialog = ref(false)
const boldDialog = ref(false)
const italicDialog = ref(false)
const codeDialog = ref(false)
const quoteDialog = ref(false)

// 对话框数据
const dialogData = ref({
  heading: { level: 1, text: '' },
  link: { text: '', url: '' },
  image: { alt: '', url: '' },
  table: { rows: 3, cols: 3 },
  bold: { text: '' },
  italic: { text: '' },
  code: { text: '' },
  quote: { text: '' }
})

// 获取当前文本区域
const getTextarea = (): HTMLTextAreaElement | null => {
  return document.querySelector('.markdown-textarea textarea') as HTMLTextAreaElement
}

// 插入 Markdown 语法
const insertMarkdown = (before: string, after = '', cursorOffset = 0) => {
  const textarea = getTextarea()
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = localValue.value.substring(start, end)
  
  const newText = localValue.value.substring(0, start) + 
                  before + selectedText + after + 
                  localValue.value.substring(end)
  
  localValue.value = newText
  
  nextTick(() => {
    textarea.focus()
    const newCursorPos = start + before.length + selectedText.length + cursorOffset
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
}

// 标题对话框处理
const openHeadingDialog = () => {
  dialogData.value.heading = { level: 1, text: '' }
  headingDialog.value = true
}

const insertHeading = () => {
  const { level, text } = dialogData.value.heading
  if (!text.trim()) return
  
  const textarea = getTextarea()
  if (!textarea) return

  const start = textarea.selectionStart
  const currentValue = localValue.value
  
  // 检查光标前是否需要换行
  const needLeadingNewline = start > 0 && currentValue[start - 1] !== '\n'
  
  const prefix = (needLeadingNewline ? '\n' : '') + '#'.repeat(level) + ' '
  const suffix = '\n'
  const fullText = prefix + text + suffix
  
  const newText = currentValue.substring(0, start) + fullText + currentValue.substring(start)
  localValue.value = newText
  
  nextTick(() => {
    textarea.focus()
    const newCursorPos = start + fullText.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
  
  headingDialog.value = false
}

// 粗体对话框处理
const openBoldDialog = () => {
  const textarea = getTextarea()
  const selectedText = textarea ? localValue.value.substring(textarea.selectionStart, textarea.selectionEnd) : ''
  dialogData.value.bold = { text: selectedText || '' }
  boldDialog.value = true
}

const insertBold = () => {
  const { text } = dialogData.value.bold
  if (!text.trim()) return
  
  const textarea = getTextarea()
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const fullText = `**${text}**`
  
  const newText = localValue.value.substring(0, start) + fullText + localValue.value.substring(end)
  localValue.value = newText
  
  nextTick(() => {
    textarea.focus()
    const newCursorPos = start + fullText.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
  
  boldDialog.value = false
}

// 斜体对话框处理
const openItalicDialog = () => {
  const textarea = getTextarea()
  const selectedText = textarea ? localValue.value.substring(textarea.selectionStart, textarea.selectionEnd) : ''
  dialogData.value.italic = { text: selectedText || '' }
  italicDialog.value = true
}

const insertItalic = () => {
  const { text } = dialogData.value.italic
  if (!text.trim()) return
  
  const textarea = getTextarea()
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const fullText = `*${text}*`
  
  const newText = localValue.value.substring(0, start) + fullText + localValue.value.substring(end)
  localValue.value = newText
  
  nextTick(() => {
    textarea.focus()
    const newCursorPos = start + fullText.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
  
  italicDialog.value = false
}

// 代码对话框处理
const openCodeDialog = () => {
  const textarea = getTextarea()
  const selectedText = textarea ? localValue.value.substring(textarea.selectionStart, textarea.selectionEnd) : ''
  dialogData.value.code = { text: selectedText || '' }
  codeDialog.value = true
}

const insertCode = () => {
  const { text } = dialogData.value.code
  if (!text.trim()) return
  
  const textarea = getTextarea()
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const fullText = `\`${text}\``
  
  const newText = localValue.value.substring(0, start) + fullText + localValue.value.substring(end)
  localValue.value = newText
  
  nextTick(() => {
    textarea.focus()
    const newCursorPos = start + fullText.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
  
  codeDialog.value = false
}

// 引用对话框处理
const openQuoteDialog = () => {
  dialogData.value.quote = { text: '' }
  quoteDialog.value = true
}

const insertQuote = () => {
  const { text } = dialogData.value.quote
  if (!text.trim()) return
  
  const textarea = getTextarea()
  if (!textarea) return

  const start = textarea.selectionStart
  const currentValue = localValue.value
  
  // 检查光标前是否需要换行
  const needLeadingNewline = start > 0 && currentValue[start - 1] !== '\n'
  
  const prefix = (needLeadingNewline ? '\n' : '') + '> '
  const suffix = '\n'
  const fullText = prefix + text + suffix
  
  const newText = currentValue.substring(0, start) + fullText + currentValue.substring(start)
  localValue.value = newText
  
  nextTick(() => {
    textarea.focus()
    const newCursorPos = start + fullText.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
  
  quoteDialog.value = false
}

// 直接插入列表项
const insertListItem = (type: 'unordered' | 'ordered') => {
  const textarea = getTextarea()
  if (!textarea) return

  const start = textarea.selectionStart
  const currentValue = localValue.value
  
  // 检查光标前是否需要换行
  const needLeadingNewline = start > 0 && currentValue[start - 1] !== '\n'
  
  const prefix = (needLeadingNewline ? '\n' : '') + (type === 'unordered' ? '- ' : '1. ')
  const fullText = prefix
  
  const newText = currentValue.substring(0, start) + fullText + currentValue.substring(start)
  localValue.value = newText
  
  nextTick(() => {
    textarea.focus()
    const newCursorPos = start + fullText.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
}

// 分割线插入
const insertDivider = () => {
  const textarea = getTextarea()
  if (!textarea) return

  const start = textarea.selectionStart
  const currentValue = localValue.value
  
  // 检查光标前是否需要换行
  const needLeadingNewline = start > 0 && currentValue[start - 1] !== '\n'
  
  const fullText = (needLeadingNewline ? '\n' : '') + '---\n'
  
  const newText = currentValue.substring(0, start) + fullText + currentValue.substring(start)
  localValue.value = newText
  
  nextTick(() => {
    textarea.focus()
    const newCursorPos = start + fullText.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
}
const openLinkDialog = () => {
  const textarea = getTextarea()
  const selectedText = textarea ? localValue.value.substring(textarea.selectionStart, textarea.selectionEnd) : ''
  dialogData.value.link = { text: selectedText || '', url: '' }
  linkDialog.value = true
}

const insertLink = () => {
  const { text, url } = dialogData.value.link
  if (!text.trim() || !url.trim()) return
  
  insertMarkdown(`[${text}](${url})`)
  linkDialog.value = false
}

// 图片对话框处理
const openImageDialog = () => {
  dialogData.value.image = { alt: '', url: '' }
  imageDialog.value = true
}

const insertImage = () => {
  const { alt, url } = dialogData.value.image
  if (!url.trim()) return
  
  insertMarkdown(`![${alt}](${url})`)
  imageDialog.value = false
}

// 表格对话框处理
const openTableDialog = () => {
  dialogData.value.table = { rows: 3, cols: 3 }
  tableDialog.value = true
}

const insertTable = () => {
  const { rows, cols } = dialogData.value.table
  if (rows < 1 || cols < 1) return
  
  const textarea = getTextarea()
  if (!textarea) return

  const start = textarea.selectionStart
  const currentValue = localValue.value
  
  // 检查光标前是否需要换行
  const needLeadingNewline = start > 0 && currentValue[start - 1] !== '\n'
  
  let table = ''
  
  // 表头
  const header = '| ' + Array(cols).fill('标题').map((_, i) => `标题${i + 1}`).join(' | ') + ' |\n'
  const separator = '| ' + Array(cols).fill('---').join(' | ') + ' |\n'
  
  table += header + separator
  
  // 数据行
  for (let i = 0; i < rows - 1; i++) {
    const row = '| ' + Array(cols).fill('内容').map((_, j) => `内容${i + 1}-${j + 1}`).join(' | ') + ' |\n'
    table += row
  }
  
  const prefix = needLeadingNewline ? '\n' : ''
  const suffix = '\n'
  const fullText = prefix + table + suffix
  
  const newText = currentValue.substring(0, start) + fullText + currentValue.substring(start)
  localValue.value = newText
  
  nextTick(() => {
    textarea.focus()
    const newCursorPos = start + fullText.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  })
  
  tableDialog.value = false
}

// 工具栏按钮配置
const toolbarButtons = [
  { icon: 'mdi-format-header-1', tooltip: '标题', action: openHeadingDialog },
  { icon: 'mdi-format-bold', tooltip: '粗体', action: openBoldDialog },
  { icon: 'mdi-format-italic', tooltip: '斜体', action: openItalicDialog },
  { icon: 'mdi-code-tags', tooltip: '代码', action: openCodeDialog },
  { icon: 'mdi-format-quote-close', tooltip: '引用', action: openQuoteDialog },
  { icon: 'mdi-format-list-bulleted', tooltip: '无序列表', action: () => insertListItem('unordered') },
  { icon: 'mdi-format-list-numbered', tooltip: '有序列表', action: () => insertListItem('ordered') },
  { icon: 'mdi-link', tooltip: '链接', action: openLinkDialog },
  { icon: 'mdi-image', tooltip: '图片', action: openImageDialog },
  { icon: 'mdi-table', tooltip: '表格', action: openTableDialog },
  { icon: 'mdi-minus', tooltip: '分割线', action: insertDivider },
]
</script>

<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <v-card class="toolbar-card mb-2" elevation="0" outlined>
      <v-card-text class="pa-2">
        <div class="d-flex align-center flex-wrap gap-1">
          <v-btn
            v-for="btn in toolbarButtons"
            :key="btn.icon"
            :icon="btn.icon"
            size="small"
            variant="text"
            color="primary"
            @click="btn.action"
          >
            <v-icon :size="mobile ? 'small' : 'default'">{{ btn.icon }}</v-icon>
            <v-tooltip activator="parent" location="top">{{ btn.tooltip }}</v-tooltip>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- 编辑器 -->
    <div class="editor-container">
      <!-- 编辑区域 -->
      <div class="editor-pane">
        <v-textarea
          v-model="localValue"
          :label="label"
          :placeholder="placeholder"
          :required="required"
          :rules="rules"
          :rows="mobile ? props.rows - 1 : props.rows"
          :max-rows="mobile ? props.maxRows - 1 : props.maxRows"
          outlined
          :hide-details="hideDetails"
          class="markdown-textarea"
          auto-grow
          @keydown="handleKeydown"
        >
          <template #prepend-inner>
            <v-icon color="grey" size="small">mdi-markdown</v-icon>
          </template>
        </v-textarea>
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="mt-2">
      <v-chip
        size="small"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-information-outline"
        class="markdown-tip"
      >
        实时预览 | 支持所有 Markdown 语法
      </v-chip>
    </div>

    <!-- 标题对话框 -->
    <v-dialog v-model="headingDialog" max-width="400">
      <v-card>
        <v-card-title>
          <v-icon left color="primary">mdi-format-header-1</v-icon>
          插入标题
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="dialogData.heading.level"
            :items="[
              { value: 1, title: 'H1 - 主标题' },
              { value: 2, title: 'H2 - 副标题' },
              { value: 3, title: 'H3 - 三级标题' },
              { value: 4, title: 'H4 - 四级标题' },
              { value: 5, title: 'H5 - 五级标题' },
              { value: 6, title: 'H6 - 六级标题' }
            ]"
            label="标题级别"
            outlined
            dense
            class="mb-3"
          />
          <v-text-field
            v-model="dialogData.heading.text"
            label="标题内容"
            outlined
            dense
            autofocus
            @keyup.enter="insertHeading"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="headingDialog = false">取消</v-btn>
          <v-btn color="primary" @click="insertHeading">插入</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 链接对话框 -->
    <v-dialog v-model="linkDialog" max-width="500">
      <v-card>
        <v-card-title>
          <v-icon left color="primary">mdi-link</v-icon>
          插入链接
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="dialogData.link.text"
            label="链接文字"
            outlined
            dense
            class="mb-3"
            placeholder="显示的文字"
          />
          <v-text-field
            v-model="dialogData.link.url"
            label="链接地址"
            outlined
            dense
            placeholder="https://example.com"
            autofocus
            @keyup.enter="insertLink"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="linkDialog = false">取消</v-btn>
          <v-btn color="primary" @click="insertLink">插入</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 图片对话框 -->
    <v-dialog v-model="imageDialog" max-width="500">
      <v-card>
        <v-card-title>
          <v-icon left color="primary">mdi-image</v-icon>
          插入图片
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="dialogData.image.url"
            label="图片链接地址"
            outlined
            dense
            class="mb-3"
            placeholder="https://example.com/image.jpg"
            autofocus
            @keyup.enter="insertImage"
          />
          <v-text-field
            v-model="dialogData.image.alt"
            label="图片描述（可选）"
            outlined
            dense
            placeholder="描述这张图片的内容"
          />
          <div class="text-caption text-grey mt-2">
            <v-icon size="small" color="grey">mdi-information-outline</v-icon>
            请确保图片链接可以公开访问
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="imageDialog = false">取消</v-btn>
          <v-btn color="primary" @click="insertImage">插入</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 表格对话框 -->
    <v-dialog v-model="tableDialog" max-width="400">
      <v-card>
        <v-card-title>
          <v-icon left color="primary">mdi-table</v-icon>
          创建表格
        </v-card-title>
        <v-card-text>
          <div class="d-flex gap-3 mb-3">
            <v-text-field
              v-model.number="dialogData.table.rows"
              label="行数"
              type="number"
              outlined
              dense
              min="1"
              max="20"
              class="flex-grow-1"
            />
            <v-text-field
              v-model.number="dialogData.table.cols"
              label="列数"
              type="number"
              outlined
              dense
              min="1"
              max="10"
              class="flex-grow-1"
            />
          </div>
          <div class="text-caption text-grey">
            <v-icon size="small" color="grey">mdi-information-outline</v-icon>
            将创建一个 {{ dialogData.table.rows }} 行 × {{ dialogData.table.cols }} 列的表格模板
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="tableDialog = false">取消</v-btn>
          <v-btn color="primary" @click="insertTable">创建</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 粗体对话框 -->
    <v-dialog v-model="boldDialog" max-width="400">
      <v-card>
        <v-card-title>
          <v-icon left color="primary">mdi-format-bold</v-icon>
          插入粗体
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="dialogData.bold.text"
            label="粗体内容"
            outlined
            dense
            placeholder="输入要加粗的文字"
            autofocus
            @keyup.enter="insertBold"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="boldDialog = false">取消</v-btn>
          <v-btn color="primary" @click="insertBold">插入</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 斜体对话框 -->
    <v-dialog v-model="italicDialog" max-width="400">
      <v-card>
        <v-card-title>
          <v-icon left color="primary">mdi-format-italic</v-icon>
          插入斜体
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="dialogData.italic.text"
            label="斜体内容"
            outlined
            dense
            placeholder="输入要倾斜的文字"
            autofocus
            @keyup.enter="insertItalic"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="italicDialog = false">取消</v-btn>
          <v-btn color="primary" @click="insertItalic">插入</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 代码对话框 -->
    <v-dialog v-model="codeDialog" max-width="400">
      <v-card>
        <v-card-title>
          <v-icon left color="primary">mdi-code-tags</v-icon>
          插入代码
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="dialogData.code.text"
            label="代码内容"
            outlined
            dense
            placeholder="输入代码片段"
            autofocus
            @keyup.enter="insertCode"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="codeDialog = false">取消</v-btn>
          <v-btn color="primary" @click="insertCode">插入</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 引用对话框 -->
    <v-dialog v-model="quoteDialog" max-width="400">
      <v-card>
        <v-card-title>
          <v-icon left color="primary">mdi-format-quote-close</v-icon>
          插入引用
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="dialogData.quote.text"
            label="引用内容"
            outlined
            dense
            placeholder="输入要引用的文字"
            autofocus
            @keyup.enter="insertQuote"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="quoteDialog = false">取消</v-btn>
          <v-btn color="primary" @click="insertQuote">插入</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.markdown-editor {
  position: relative;
}

.toolbar-card {
  background: rgba(245, 245, 245, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.split-editor {
  display: block;
  min-height: 200px;
}

.editor-container {
  display: block;
}

.editor-pane {
  display: flex;
  flex-direction: column;
}

.markdown-textarea {
  flex: 1;
  margin-top: 0 !important;
}

/* 对话框样式增强 */
.v-dialog .v-card-title {
  background: rgba(25, 118, 210, 0.05);
  border-bottom: 1px solid rgba(25, 118, 210, 0.1);
}

.markdown-tip {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* 工具栏按钮动画 */
.v-btn {
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(25, 118, 210, 0.2);
}

/* 移动端适配 */
@media (max-width: 600px) {
  .toolbar-card .v-card-text {
    padding: 8px;
  }
  
  .editor-container {
    gap: 8px;
  }
  
  .markdown-tip {
    display: none;
  }
}

/* 输入焦点增强 */
.v-text-field:focus-within,
.v-textarea:focus-within {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
}
</style>