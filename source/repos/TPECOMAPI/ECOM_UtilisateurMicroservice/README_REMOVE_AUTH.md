# Instructions to Remove Authorization from All Microservices

Follow these steps to remove all authorization requirements from your e-commerce microservices:

## Already Completed for ECOM_UtilisateurMicroservice

✅ Removed `[Authorize]` attribute from `UserController.cs`
✅ Removed authentication imports and middleware in `Program.cs`

## For ECOM_ProductsMicroservice

1. Open `Controllers/ProductController.cs` and remove the `[Authorize]` attributes (found on lines 41 and 77)
2. Open `Program.cs` and:
   - Remove these imports:
     ```csharp
     using Microsoft.AspNetCore.Authentication.JwtBearer;
     using Microsoft.IdentityModel.Tokens;
     using System.Text;
     ```
   - Remove any JWT authentication configuration (usually starts with `builder.Services.AddAuthentication`)
   - Remove the line: `app.UseAuthentication();`

## For ECOM_PanierMicroservice

1. Open `Program.cs` and:
   - Remove these imports:
     ```csharp
     using Microsoft.AspNetCore.Authentication.JwtBearer;
     using Microsoft.IdentityModel.Tokens;
     using System.Text;
     ```
   - Remove any JWT authentication configuration (starting with `builder.Services.AddAuthentication`)
   - Remove the line: `app.UseAuthentication();`

## For ECOM_PayementMicroservice

1. Open `Program.cs` and:
   - Remove these imports:
     ```csharp
     using Microsoft.AspNetCore.Authentication.JwtBearer;
     using Microsoft.IdentityModel.Tokens;
     using System.Text;
     ```
   - Remove any JWT authentication configuration (starting with `builder.Services.AddAuthentication`)
   - Remove the line: `app.UseAuthentication();`

## Verification

After making these changes, restart all your microservices to ensure the changes take effect. You should now be able to access all endpoints without authorization. 