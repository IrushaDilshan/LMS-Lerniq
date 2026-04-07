import codecs

try:
    with open('compile_error3.txt', 'rb') as f:
        content = f.read()
    content = content.decode('utf-16le', errors='replace').replace('\r', '')

    for line in content.split('\n'):
        if '[ERROR]' in line or '.java' in line:
            print(line)
except Exception as e:
    print(e)
