package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import java.time.LocalDateTime;

/**
 * This is a REST controller for Articles
 */

@Tag(name = "Articles")
@RequestMapping("/api/articles")
@RestController
@Slf4j
public class ArticlesController extends ApiController {

    @Autowired
    ArticlesRepository articlesRepository;

    /**
     * List all Articles
     * 
     * @return an iterable of Articles
     */
    @Operation(summary= "List all articles")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<Articles> allArticles() {
        Iterable<Articles> articles = articlesRepository.findAll();
        return articles;
    }

    /**
     * Get a single article by id
     * 
     * @param id the id of the article
     * @return an article
     */
    @Operation(summary= "Get a single article")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Articles getById(
            @Parameter(name="id") @RequestParam Long id) {
        Articles article = articlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Articles.class, id));

        return article;
    }

    /**
     * Create a new article
     * 
     * @param title the title of the article
     * @param url the url of the article
     * @param explanation the explanation of the article
     * @param email the email of the submitter
     * @return the saved article
     */
    @Operation(summary = "Create a new article")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public Articles postArticles(
            @Parameter(name="title") @RequestParam String title,
            @Parameter(name="url") @RequestParam String url,
            @Parameter(name="explanation") @RequestParam(required = false) String explanation,
            @Parameter(name="email") @RequestParam String email) {

        Articles article = new Articles();
        article.setTitle(title);
        article.setUrl(url);
        article.setExplanation(explanation);
        article.setEmail(email);
        article.setDateAdded(LocalDateTime.now());

        Articles savedArticle = articlesRepository.save(article);

        return savedArticle;
    }

    /**
     * Update a single article
     * 
     * @param id       id of the article to update
     * @param incoming the new article
     * @return the updated article object
     */
    @Operation(summary= "Update a single article")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public Articles updateArticle(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid Articles incoming) {

        Articles article = articlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Articles.class, id));

        article.setTitle(incoming.getTitle());
        article.setUrl(incoming.getUrl());
        article.setExplanation(incoming.getExplanation());
        article.setEmail(incoming.getEmail());
        article.setDateAdded(incoming.getDateAdded());

        articlesRepository.save(article);

        return article;
    }

    /**
     * Delete an Article
     * 
     * @param id the id of the article to delete
     * @return a message indicating the article was deleted
     */
    @Operation(summary= "Delete an Article")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteArticle(
            @Parameter(name="id") @RequestParam Long id) {
        Articles article = articlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Articles.class, id));

        articlesRepository.delete(article);
        return genericMessage("Article with id %s deleted".formatted(id));
    }
}
