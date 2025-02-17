import os
import asyncio
from dataclasses import dataclass
from typing import List, Optional

# Third-party imports
import gradio as gr
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from rich.console import Console
from rich.panel import Panel
from rich.text import Text

# Local module imports
from browser_use import Agent

load_dotenv()

# 自定义CSS样式
custom_css = """
.gradio-container {
    max-width: 1200px !important;
    margin: 0 auto !important;
}

.main-header {
    background: linear-gradient(90deg, #4F46E5, #7C3AED);
    color: white !important;
    padding: 1.5rem !important;
    border-radius: 10px;
    margin-bottom: 2rem;
    text-align: center;
}

.input-panel {
    border: 1px solid #e5e7eb;
    padding: 1.5rem;
    border-radius: 8px;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.output-panel {
    border: 1px solid #e5e7eb !important;
    padding: 1.5rem;
    border-radius: 8px;
    background: #f9fafb;
    margin-bottom: 1rem !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    width: 100% !important;
}

.output-panel h3 {
    margin-top: 0 !important;
    margin-bottom: 1rem !important;
    color: #4F46E5;
    border-bottom: 2px solid #4F46E5;
    padding-bottom: 0.5rem;
}

.submit-btn {
    background: #4F46E5 !important;
    color: white !important;
}

.clear-btn {
    border: 1px solid #e5e7eb !important;
}

/* 确保组件内容正确对齐 */
.output-panel > div {
    padding: 0 !important;
}
"""

@dataclass
class ActionResult:
	is_done: bool
	extracted_content: Optional[str]
	error: Optional[str]
	include_in_memory: bool


@dataclass
class AgentHistoryList:
	all_results: List[ActionResult]
	all_model_outputs: List[dict]


def parse_agent_history(history_str: str) -> None:
	console = Console()

	# Split the content into sections based on ActionResult entries
	sections = history_str.split('ActionResult(')

	for i, section in enumerate(sections[1:], 1):  # Skip first empty section
		# Extract relevant information
		content = ''
		if 'extracted_content=' in section:
			content = section.split('extracted_content=')[1].split(',')[0].strip("'")

		if content:
			header = Text(f'Step {i}', style='bold blue')
			panel = Panel(content, title=header, border_style='blue')
			console.print(panel)
			console.print()


async def run_browser_task(
	task: str,
	api_key: str,
	model: str = 'gpt-4o',
	headless: bool = True,
) -> tuple:
	if not api_key.strip():
		return '⚠️ 请提供有效的 API 密钥', ''

	os.environ['OPENAI_API_KEY'] = api_key

	try:
		agent = Agent(
			task=task,
			llm=ChatOpenAI(model='gpt-4o', temperature=0.6),
		)
		result = await agent.run()
		
		# 构建更友好的步骤展示界面
		process_html = '''
		<div style="font-family: Arial; padding: 1rem;">
			<div class="task-header" style="
				background: linear-gradient(90deg, #4F46E5, #7C3AED);
				color: white;
				padding: 1rem;
				border-radius: 8px;
				margin-bottom: 1rem;
			">
				<h3 style="margin:0">🚀 执行任务</h3>
				<p style="margin:0.5rem 0 0 0">{task}</p>
			</div>
			<div class="steps-container">
		'''.format(task=task)

		if hasattr(result, 'all_results'):
			for idx, action in enumerate(result.all_results[:-1], 1):
				# 提取信息
				eval_info = action.extracted_content
				if "Eval:" in eval_info:
					eval_status = eval_info.split("Eval:")[1].split("-")[0].strip()
					eval_detail = eval_info.split("-")[1].strip() if "-" in eval_info else ""
				else:
					# 如果没有 Eval 相关信息，则直接将全部内容作为展示
					eval_status = action.extracted_content
					eval_detail = ""
				
				memory = ""
				if "Memory:" in eval_info:
					memory = eval_info.split("Memory:")[1].split("Next goal:")[0].strip()
    
				next_goal = ""
				if "Next goal:" in eval_info:
					next_goal = eval_info.split("Next goal:")[1].split("Action")[0].strip()
				
				# 当 memory 和 next_goal 均为空时，直接展示内容（避免信息缺失）
				content = "" if memory or next_goal else action.extracted_content
				
				# 构建步骤卡片
				process_html += f'''
				<div class="step-card" style="
					border: 1px solid #e5e7eb;
					border-radius: 8px;
					padding: 1rem;
					margin-bottom: 1rem;
					background: white;
					box-shadow: 0 1px 3px rgba(0,0,0,0.1);
				">
					<div class="step-header" style="
						display: flex;
						align-items: center;
						margin-bottom: 0.5rem;
					">
						<span style="
							background: #4F46E5;
							color: white;
							padding: 0.25rem 0.5rem;
							border-radius: 4px;
							margin-right: 0.5rem;
						">步骤 {idx}</span>
						<span style="color: {'#059669' if action.is_done else '#9333EA'}">
							{eval_status}
						</span>
					</div>
					<div class="step-content" style="margin-left: 1rem;">
						{ f'<div class="memory" style="background: #f3f4f6; padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0;"><span style="color: #4B5563">🧠 思考：</span>{memory}</div>' if memory else '' }
						{ f'<div class="goal" style="background: #ede9fe; padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0;"><span style="color: #4B5563">🎯 目标：</span>{next_goal}</div>' if next_goal else '' }
						{ f'<div class="content" style="margin: 0.5rem 0; color: #374151;">{content}</div>' if content else '' }
					</div>
				</div>
				'''

			process_html += '</div></div>'

			# 构建最终报告
			if result.all_results and result.all_results[-1].is_done:
				final_content = result.all_results[-1].extracted_content
				final_report = f'''
				<div style="font-family: Arial; padding: 1rem;">
					<div style="
						background: white;
						border: 1px solid #e5e7eb;
						border-radius: 8px;
						padding: 1.5rem;
						box-shadow: 0 1px 3px rgba(0,0,0,0.1);
					">
						<h3 style="
							color: #4F46E5;
							margin-top: 0;
							border-bottom: 2px solid #4F46E5;
							padding-bottom: 0.5rem;
						">📊 分析报告</h3>
						<div style="
							line-height: 1.6;
							color: #1f2937;
						">{final_content}</div>
					</div>
				</div>
				'''
			else:
				final_report = '''
				<div style="
					font-family: Arial;
					padding: 1rem;
					color: #6b7280;
					text-align: center;
				">
					暂无分析报告
				</div>
				'''
		else:
			process_html = f'<div style="padding: 1rem;">{str(result)}</div>'
			final_report = ''
			
		return (process_html, final_report)
	except Exception as e:
		error_html = f'''
		<div style="
			font-family: Arial;
			padding: 1rem;
			background: #fee2e2;
			border: 1px solid #ef4444;
			border-radius: 8px;
			color: #dc2626;
		">
			<h4 style="margin:0">❌ 执行出错</h4>
			<p style="margin:0.5rem 0 0 0">{str(e)}</p>
		</div>
		'''
		return error_html, ''


def create_ui():
	with gr.Blocks(title='智能浏览器助手', css=custom_css) as interface:
		gr.Markdown('# 🌐 智能浏览器助手', elem_classes=["main-header"])
		
		with gr.Row():
			with gr.Column(elem_classes=["input-panel"]):
				api_key = gr.Textbox(
					label='OpenAI API Key',
					placeholder='sk-...',
					type='password',
					value=os.getenv('OPENAI_API_KEY', '')
				)
				task = gr.Textbox(
					label='任务描述',
					placeholder='例如：访问 https://github.com 并分析页面设计...',
					lines=3,
				)
				model = gr.Dropdown(
					choices=['gpt-4', 'gpt-3.5-turbo'],
					label='选择模型',
					value='gpt-4'
				)
				headless = gr.Checkbox(label='后台运行', value=True)
				
				with gr.Row():
					submit_btn = gr.Button('开始任务', elem_classes=["submit-btn"])
					clear_btn = gr.Button('清除', elem_classes=["clear-btn"])

			# 输出面板
			with gr.Column():
				with gr.Group(elem_classes=["output-panel"]):
					gr.Markdown("### 🤔 思考与操作过程")
					process_output = gr.HTML(container=True)
				
				with gr.Group(elem_classes=["output-panel"]):
					gr.Markdown("### 📝 实际报告")
					report_output = gr.HTML(container=True)

		# 添加示例任务
		gr.Examples(
			examples=[
				["访问 https://github.com，分析页面设计和用户体验"],
				["访问 https://www.python.org 并搜索 'web scraping'"],
			],
			inputs=task,
			label="示例任务"
		)

		# 绑定事件
		submit_btn.click(
			fn=lambda *args: asyncio.run(run_browser_task(*args)),
			inputs=[task, api_key, model, headless],
			outputs=[process_output, report_output],
		)
		
		clear_btn.click(
			fn=lambda: (None, None),
			inputs=None,
			outputs=[process_output, report_output],
		)

	return interface


if __name__ == '__main__':
	demo = create_ui()
	demo.launch(
		server_name="0.0.0.0",
		server_port=7860,
		share=True
	)