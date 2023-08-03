import subprocess
import sys


def create_file(file_name, code):
    try:
        local_file_name = './' + file_name
        f = open(local_file_name, 'w')
        f.write(code)
        f.close()
        return local_file_name
    except:
        return False


def lambda_handler(event, context):
    state = False
    output = []

    # {name}.java파일 생성
    FILE_NAME = event["name"] + ".java"
    CODE_NAME = create_file(FILE_NAME, event["code"])

    try:
        # code.py를 실행하는 명령
        command = [sys.executable, CODE_NAME]

        # child process 실행
        child = subprocess.run(command, text=True, input=event["input"], capture_output=True, timeout=3)

        # ERROR
        if child.stderr:
            err_msg = child.stderr.split('\n')
            state = False
            output.append(err_msg[3])

        # GOOD
        else:
            state = True
            output.append(child.stdout.rstrip())

    # timeout 설정보다 길게 작동한 경우
    except subprocess.TimeoutExpired:
        state = False
        output.append("시간초과")

    # Error 메시지 출력
    except Exception as e:
        print('Exception: ', e)

    # 결과 JSON
    result = {
        "state": state,
        "output": output,
        "userId": event["userId"]
    }
    return result
