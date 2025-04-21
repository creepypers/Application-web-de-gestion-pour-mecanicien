﻿using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECOM_ProductsMicroservice.Models
{
    public class Product
    {
        public int ProductId { get; set; }
        
        [Required(ErrorMessage = "Le nom est obligatoire")]
        public string? Name { get; set; }
        
        [Required(ErrorMessage = "La description courte est obligatoire")]
        public string? ShortDescription { get; set; }
        
        [Required(ErrorMessage = "La description complète est obligatoire")]
        public string? Description { get; set; }
        
        [Required(ErrorMessage = "Le prix est obligatoire")]
        [Range(0.01, 100000, ErrorMessage = "Le prix doit être supérieur à 0")]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
        
        [Required(ErrorMessage = "La catégorie est obligatoire")]
        public string? Category { get; set; }
        
        [Required(ErrorMessage = "L'URL de l'image est obligatoire")]
        public string? ImageUrl { get; set; }
        
        public bool IsNewArrival { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public double Rating { get; set; } = 0;
        
        public int SellerId { get; set; }
        public Seller? Seller { get; set; }
    }
}
