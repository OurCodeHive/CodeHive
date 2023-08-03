package com.java.compile;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class CompileService {

    private String createFile(String fileName, String code) {
        try {
            String localFileName = "./" + fileName;
            Writer writer = new OutputStreamWriter(new FileOutputStream(localFileName), StandardCharsets.UTF_8);

            // 소스 코드에 @SuppressWarnings("unchecked") 어노테이션 추가
            String annotatedCode = addSuppressWarnings(code);
            writer.write(annotatedCode);

            writer.close();
            return localFileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private String addSuppressWarnings(String code) {
        // 소스 코드에서 import문을 분리
        String[] lines = code.split("\\r?\\n");
        List<String> importLines = new ArrayList<>();
        List<String> otherLines = new ArrayList<>();

        boolean addedSuppressWarnings = false; // 이미 @SuppressWarnings가 추가되었는지 확인하는 플래그

        for (String line : lines) {
            if (line.trim().startsWith("import ")) {
                importLines.add(line);
            } else {
                if (!addedSuppressWarnings) {
                    // 처음으로 @SuppressWarnings를 추가할 위치에 도달하면 추가
                    otherLines.add("@SuppressWarnings(\"unchecked\")");
                    addedSuppressWarnings = true;
                }
                otherLines.add(line);
            }
        }

        // @SuppressWarnings("unchecked") 어노테이션이 추가되지 않은 경우, 소스 코드의 맨 마지막에 추가
        if (!addedSuppressWarnings) {
            otherLines.add("@SuppressWarnings(\"unchecked\")");
        }

        // import문과 다른 코드를 합쳐서 반환
        StringBuilder annotatedCodeBuilder = new StringBuilder();
        annotatedCodeBuilder.append(String.join(System.lineSeparator(), importLines))
                .append(System.lineSeparator())
                .append(System.lineSeparator())
                .append(String.join(System.lineSeparator(), otherLines));

        return annotatedCodeBuilder.toString();
    }

    public ResponseDto compileAndRun(RequestDto requestDto) {
        boolean state = true;
        List<String> output = new ArrayList<>();

        String name = requestDto.getName();
        String code = requestDto.getCode();
        String input = requestDto.getInput();

        String FILE_NAME = name + ".java";
        String CODE_NAME = createFile(FILE_NAME, code);

        try {
            String[] command = {
                    System.getProperty("java.home") + "/bin/java",
                    "-cp", ".",
                    "-Dfile.encoding=UTF-8",
                    CODE_NAME
            };

            // child process 실행
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectInput(ProcessBuilder.Redirect.PIPE);
            pb.redirectOutput(ProcessBuilder.Redirect.PIPE);
            pb.redirectError(ProcessBuilder.Redirect.PIPE);

            // 환경 변수 설정 (LANG 환경 변수를 UTF-8로 설정)
            Map<String, String> environment = pb.environment();
            environment.put("LANG", "en_US.UTF-8");

            Process child = pb.start();

            // 입력 데이터를 UTF-8 인코딩으로 전달
            try (OutputStreamWriter writer = new OutputStreamWriter(child.getOutputStream(), StandardCharsets.UTF_8)) {
                writer.write(input);
            }

            // 실행 시간 설정
            long timeoutDuration = 5; // 5초
            TimeUnit timeoutUnit = TimeUnit.SECONDS;

            // 실행 시간 체크
            boolean completed = child.waitFor(timeoutDuration, timeoutUnit);
            if (!completed) {
                // 시간 초과 발생
                state = false;
                output.add("시간초과");
                child.destroyForcibly();
            } else {
                // 정상 출력 처리
                try (InputStream stdout = child.getInputStream();
                     BufferedReader reader = new BufferedReader(new InputStreamReader(stdout, StandardCharsets.UTF_8))) {
                    String line;
                    StringBuilder outputBuilder = new StringBuilder();
                    while ((line = reader.readLine()) != null) {
                        outputBuilder.append(line).append(System.lineSeparator());
                    }
                    output.add(outputBuilder.toString().trim());
                }

                // 에러 출력 처리
                try (InputStream stderr = child.getErrorStream();
                     BufferedReader errorReader = new BufferedReader(new InputStreamReader(stderr, StandardCharsets.UTF_8))) {
                    String errorLine;
                    StringBuilder errorBuilder = new StringBuilder();
                    while ((errorLine = errorReader.readLine()) != null) {
                        errorBuilder.append(errorLine).append(System.lineSeparator());
                        state = false; // 컴파일이 실패했으므로 state를 false로 설정
                    }

                    if (!state) {
                        // 에러 메시지 전부를 추가
                        output.addAll(parseErrorMessages(errorBuilder.toString()));
                    }
                }
            }
            // 컴파일이 실패했으므로 state를 false로 설정
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            output.add("compilation failed");
            state = false;
        }

        // 결과 반환
        String userId = "";
        return new ResponseDto(state, output, userId);
    }


    private List<String> parseErrorMessages(String errorOutput) {
        // 여러 줄의 에러 메시지를 추출하는 로직 구현
        String[] lines = errorOutput.split(System.lineSeparator());
        List<String> errorMessages = new ArrayList<>();
        Collections.addAll(errorMessages, lines);
        return errorMessages;
    }

}
