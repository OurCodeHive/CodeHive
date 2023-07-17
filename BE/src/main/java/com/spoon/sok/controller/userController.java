package com.spoon.sok.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/")
public class userController {

    // id로 Comment 조회
    @GetMapping("{id}")
    public ResponseEntity<?> findCommentById(@PathVariable Long id) {
        return ResponseEntity.ok().body("commentService.findCommentById(id)");
    }

}
