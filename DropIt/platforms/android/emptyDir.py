import os

# traverse root directory, and list directories as dirs and files as files
for root, dirs, files in os.walk("."):
    if (len(files) == 0 and len(dirs) == 0):
		open (root + "\\" + "readme.md", "wb");
    