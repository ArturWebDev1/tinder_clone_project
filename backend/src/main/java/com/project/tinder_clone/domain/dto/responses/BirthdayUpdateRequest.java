package com.project.tinder_clone.domain.dto.responses;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BirthdayUpdateRequest {
    @NotNull
    @Past // опционально: запрещает будущие даты
    // @JsonFormat(pattern = "yyyy-MM-dd") // можно опустить, ISO и так работает
    private LocalDate birthdate;
}
