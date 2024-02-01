package com.example.iworks.domain.file.dto.request;

import com.example.iworks.domain.file.domain.File;
import com.example.iworks.global.model.entity.Code;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class FileUploadRequestDto {

    private int fileCategoryCodeId; //파일 카테고리 아이디
    private int fileOwnerId; //파일 주체 아이디
    private int fileUploaderId; //파일 등록자 아이디
    private String fileOriginalName; //원본 파일명
    private String fileSaveName; //저장 파일명
    private long fileSize; //파일 사이즈
    private String fileType; //파일 타입
    private LocalDateTime fileCreatedAt; //파일 등록 일시

    public File toEntity(Code code) {
        return File.builder()
                .fileCategoryCode(code)
                .fileOwnerId(fileOwnerId)
                .fileUploaderId(fileUploaderId)
                .fileOriginalName(fileOriginalName)
                .fileSaveName(fileSaveName)
                .fileSize(fileSize)
                .fileType(fileType)
                .fileCreatedAt(fileCreatedAt)
                .build();
    }
    
}
