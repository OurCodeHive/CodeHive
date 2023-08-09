package com.spoon.sok.aws;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.spoon.sok.domain.study.dto.responseDTO.FileInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class S3Service {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;
    private final AmazonS3 amazonS3;

    public String upload(MultipartFile multipartFile) throws IOException {

        String s3FileName = UUID.randomUUID() + "-" + multipartFile.getOriginalFilename();
        ObjectMetadata objMeta = new ObjectMetadata();

        // 주소로 접근 했을때 이미지 보여줌
        objMeta.setContentType(multipartFile.getContentType());
        // 주소로 접근 했을때 다운로드됨
        // objMeta.setContentLength(multipartFile.getInputStream().available());

        amazonS3.putObject(bucket, s3FileName, multipartFile.getInputStream(), objMeta);
        return amazonS3.getUrl(bucket, s3FileName).toString();
    }

    public FileInfoDto uploadWithDownLoad(MultipartFile multipartFile) throws IOException {
        FileInfoDto fileInfoDto = new FileInfoDto();
        fileInfoDto.setOriginName(multipartFile.getOriginalFilename());

        String s3FileName = UUID.randomUUID() + "-" + multipartFile.getOriginalFilename();
        ObjectMetadata objMeta = new ObjectMetadata();
        objMeta.setContentLength(multipartFile.getInputStream().available());
        amazonS3.putObject(bucket, s3FileName, multipartFile.getInputStream(), objMeta);

        // FileInfoDto 만들기
        System.out.println(multipartFile.getOriginalFilename());
        String[] info = Objects.requireNonNull(multipartFile.getOriginalFilename()).split("\\.");


        fileInfoDto.setOriginName(info[0]);
        fileInfoDto.setExtension(info[1]);
        fileInfoDto.setUniqueName(s3FileName);
        fileInfoDto.setSize(multipartFile.getSize());
        fileInfoDto.setUrl(amazonS3.getUrl(bucket, s3FileName).toString());

        return fileInfoDto;
    }
}