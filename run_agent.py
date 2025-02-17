from langchain_openai import ChatOpenAI
from browser_use import Agent
import asyncio
from dotenv import load_dotenv
import os

# 加载环境变量
load_dotenv()

async def main():
    # 创建 ChatOpenAI 实例（可以尝试调整模型和参数以获得更智能的输出）
    llm = ChatOpenAI(
        model="gpt-4o",  # 如果你的 API 有权限，可使用其它模型，如 gpt-4o 或 gpt-3.5-turbo
        temperature=0.9,  # 提高 temperature 激发更多创意
        api_key=os.getenv("OPENAI_API_KEY")
    )
    
    # 创建 Agent 实例，并修改任务描述以获得更智能的分析结果
    agent = Agent(
        task="访问 https://github.com，详细分析页面设计、主要功能和用户体验，并提出改进建议，给出一个智能且富有见解的总结。",
        llm=llm,
    )
    
    try:
        # 运行 agent
        result = await agent.run()
        
        # 格式化输出结果，按步骤展示
        print("\n=== 任务步骤回顾 ===")
        for idx, action in enumerate(result.all_results, 1):
            status = "完成" if action.is_done else "进行中"
            print(f"\n步骤 {idx} ({status}):")
            print(action.extracted_content)
        
        # 提取并展示最终总结
        final_result = next((action.extracted_content for action in result.all_results if action.is_done), None)
        if final_result:
            print("\n=== 最终总结 ===")
            print(final_result)
        else:
            print("\n没有检测到最终完成的步骤。")
    except Exception as e:
        print("运行出错:", str(e))

if __name__ == "__main__":
    # 运行异步主函数
    asyncio.run(main()) 