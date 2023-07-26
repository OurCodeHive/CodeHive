package com.spoon.sok.domain.comedy.controller;

import com.spoon.sok.domain.comedy.entity.CodingLiterature;
import com.spoon.sok.domain.comedy.service.ComedyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/")
public class ComedyController {

    private final ComedyService comedyService;

    @GetMapping("comedy")
    public ResponseEntity<?> comedy(@RequestParam("random") String comedyId) {
        Optional<CodingLiterature> comedy = comedyService.getComedy(comedyId);

        Map<String, Object> response = new HashMap<>();

        response.put("status", 200);
        response.put("comedy", comedy);
        response.put("message", "코딩문학제 로딩 완료");

        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
    }
}
