package com.example.iworks.domain.schedule.repository.schedule.custom;

import com.example.iworks.domain.schedule.domain.Schedule;
import com.example.iworks.domain.schedule.dto.schedule.response.ScheduleResponseDto;
import com.example.iworks.domain.schedule.dto.scheduleAssign.request.AssigneeInfo;
import com.example.iworks.global.dto.DateCondition;
import org.springframework.validation.annotation.Validated;

import java.util.List;

public interface ScheduleSearchRepository {

   List<ScheduleResponseDto> findByKeyword(String keyword);

   List<Schedule> findScheduleByAssigneeInfo(List<AssigneeInfo> assigneeInfoList, @Validated DateCondition dateCondition, boolean onlyTask);
}


