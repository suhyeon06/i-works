package com.example.iworks.domain.file.service;

import com.example.iworks.domain.file.domain.File;
import com.example.iworks.domain.file.dto.request.FileUploadRequestDto;
import com.example.iworks.domain.file.repository.FileRepository;
import com.example.iworks.global.model.entity.Code;
import com.example.iworks.global.model.repository.CodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class FileServiceImpl implements FileService{

    private final FileRepository fileRepository;
    private final CodeRepository codeRepository;

    @Override
    public void saveFile(FileUploadRequestDto fileUploadRequestDto) {
        Code code = codeRepository.findById(fileUploadRequestDto.getFileCategoryCodeId())
                .orElseThrow(IllegalStateException::new);
        fileRepository.save(fileUploadRequestDto.toEntity(code));
    }

    @Override
    public void deleteFile(int fileId) {
        File findFile = fileRepository.findById(fileId)
                .orElseThrow(IllegalStateException::new);
        findFile.delete();
    }

}
