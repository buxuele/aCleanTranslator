import os

# --- 配置 ---
# 项目根目录的名称
PROJECT_NAME = "./cleanTranslator"

# 定义项目的文件和目录结构
# 格式： '目录/文件名' 或 '目录/'
# 注意：'icons/' 目录是特意留空的，因为图标是二进制文件，
#       这里只创建目录，你需要自己准备 .png 图片放进去。
STRUCTURE = [
    "manifest.json",
    "popup.html",
    "README.md",
    ".gitignore",
    "css/banner.css",
    "css/popup.css",
    "js/background.js",
    "js/content_script.js",
    "js/popup.js",
    "js/api/deepl_translator.js",
    "js/api/config.js",
    "icons/"  # 这是一个目录
]

# .gitignore 文件的初始内容
GITIGNORE_CONTENT = """
# 忽略敏感的 API 配置文件
js/api/config.js

# 忽略 Node.js 依赖（如果未来使用）
node_modules/

# 忽略打包工具的输出目录
dist/
build/

# 忽略操作系统生成的文件
.DS_Store
Thumbs.db
"""

def create_project_structure():
    """
    根据预定义的结构创建项目目录和文件
    """
    # 1. 创建项目根目录
    if not os.path.exists(PROJECT_NAME):
        os.makedirs(PROJECT_NAME)
        print(f"创建根目录: {PROJECT_NAME}")
    
    # 切换到项目根目录中进行操作
    os.chdir(PROJECT_NAME)
    
    # 2. 遍历结构列表，创建文件和目录
    for path in STRUCTURE:
        # 如果路径以 '/' 结尾，则它是一个目录
        if path.endswith('/'):
            dir_path = path
            if not os.path.exists(dir_path):
                os.makedirs(dir_path)
                print(f"  创建目录: {dir_path}")
        # 否则，它是一个文件
        else:
            # 分离出文件所在的目录路径
            dir_path = os.path.dirname(path)
            
            # 如果存在目录路径 (例如 'css/banner.css' 中的 'css')，则创建它
            if dir_path and not os.path.exists(dir_path):
                os.makedirs(dir_path)
                print(f"  创建目录: {dir_path}")

            # 创建空文件
            if not os.path.exists(path):
                with open(path, 'w', encoding='utf-8') as f:
                    # 如果是 .gitignore 文件，写入预设内容
                    if os.path.basename(path) == '.gitignore':
                        f.write(GITIGNORE_CONTENT.strip())
                        print(f"  创建文件: {path} (并写入内容)")
                    else:
                        print(f"  创建文件: {path}")

    print("\n项目结构创建完毕！")
    print(f"请进入 '{PROJECT_NAME}' 目录开始填充代码。")
    print("别忘了在 'icons/' 目录中放入你的 16x16, 48x48, 128x128 像素的图标文件。")


if __name__ == "__main__":
    create_project_structure()