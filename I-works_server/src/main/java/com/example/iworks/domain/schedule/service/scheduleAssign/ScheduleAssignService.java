package com.example.iworks.domain.schedule.service.scheduleAssign;

import com.example.iworks.domain.schedule.domain.ScheduleAssign;
import com.example.iworks.domain.schedule.dto.scheduleAssign.request.AssigneeInfo;
import com.example.iworks.domain.schedule.dto.scheduleAssign.response.ScheduleAssignResponseDto;
import com.example.iworks.global.dto.DateCondition;

import java.util.List;

public interface ScheduleAssignService {

    List<ScheduleAssignResponseDto> findTaskByUser(int userId, DateCondition dateCondition);

    List<ScheduleAssignResponseDto> findByUser(int userId, DateCondition dateCondition);

    List<ScheduleAssignResponseDto> findByAssignees(List<AssigneeInfo> requestDtoList, DateCondition dateCondition);

    List<AssigneeInfo> findUserBelongs(int userId);

    List<String> getAssigneeNameList(List<ScheduleAssign> scheduleAssignList);

}
