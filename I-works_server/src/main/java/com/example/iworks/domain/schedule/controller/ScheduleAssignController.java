package com.example.iworks.domain.schedule.controller;

import com.example.iworks.domain.schedule.dto.scheduleAssign.request.ScheduleAssignSearchParameter;
import com.example.iworks.domain.schedule.service.scheduleAssign.ScheduleAssignService;
import com.example.iworks.global.dto.DateCondition;
import com.example.iworks.global.util.JwtProvider;
import com.example.iworks.global.util.Response;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedule-assign")
public class ScheduleAssignController {

    private final ScheduleAssignService scheduleAssignService;
    private final Response response;
    private final JwtProvider jwtProvider;

    /**
     *  담당자별 할일 조회
     * @param searchParameterAndDate
     * @return List<ScheduleAssignResponseDto> 할일 담당 리스트
     */
    @PostMapping("/get-by-assignees-and-date")
    public ResponseEntity<Map<String,Object>> getAllByAssigneesAndDate(@RequestBody @Validated ScheduleAssignSearchParameter searchParameterAndDate){
        return response.handleSuccess(scheduleAssignService.findByAssignees(searchParameterAndDate.getAssigneeInfos(), searchParameterAndDate.getDateCondition()));
    }

    /**
     *  로그인 한 사용자의 할일 조회
     * @param authorizationToken
     * @return List<ScheduleAssignResponseDto> 할일 담당 리스트
     */
    @GetMapping("/")
    public ResponseEntity<Map<String,Object>> getAllByUser(@RequestHeader("Authorization") String authorizationToken){
        return response.handleSuccess(scheduleAssignService.findByUser(jwtProvider.getUserId(authorizationToken), null));
    }

    /**
     *  날짜 조건 내 로그인 한 사용자의 할일 조회
     * @param authorizationToken
     * @param dateCondition
     * @return List<ScheduleAssignResponseDto> 할일 담당 리스트
     */
    @PostMapping("/task/date")
    public ResponseEntity<Map<String,Object>> getAllByUserAndDate(@RequestHeader("Authorization") String authorizationToken,
                                                                  @RequestBody @Valid DateCondition dateCondition,
                                                                  BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return response.handleFail(bindingResult.getAllErrors().get(0).getDefaultMessage(),null);
        }
        return response.handleSuccess(
                scheduleAssignService.findTaskByUser(jwtProvider.getUserId(authorizationToken), dateCondition));
    }

}
