import { App, MarkdownView, Modal, Setting, Plugin } from 'obsidian'

export default class CommentHoverPlugin extends Plugin {
	async onload() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView)
		if (!view) {
			console.error('Unable to access workspace view.')
			return
		}

		this.registerEvent(this.app.workspace.on('editor-menu', (menu) => {
			menu.addItem((item) => {
				item.setTitle('Add comment')
					.setIcon('message-square-quote')
					.onClick(() => {
						const selection = view?.editor.getSelection()

						new CommentModal(this.app, (result) => {
							view.editor.replaceSelection(`<abbr class="hover-comment" data-title="${result}">${selection}</abbr>`)
						}).open()

					})
			})
		}))
	}
}

class CommentModal extends Modal {
	constructor(app: App, onSubmit: (result: string) => void) {
		super(app);
		this.setTitle('Add comment')

		const { contentEl } = this;

		let name = ''
		new Setting(contentEl)
			.setName('Comment')
			.addText((text) => {
				text.onChange((value) => {
					name = value
				})
			})

		new Setting(contentEl)
			.addButton((button) => {
				button
					.setButtonText('Add comment')
					.setCta()
					.onClick(() => {
						this.close()
						onSubmit(name)
					})
			})
	}
}
