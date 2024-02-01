package com.example.iworks.domain.file.service;

import com.example.iworks.domain.file.dto.request.FileUploadRequestDto;

public interface FileService {

    void saveFile(FileUploadRequestDto fileUploadRequestDto);

    void deleteFile(int fileId);
}
