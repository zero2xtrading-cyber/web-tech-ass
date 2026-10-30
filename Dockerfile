# Official lightweight PHP Apache image
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Copy all project files into Apache web root
COPY . /var/www/html/

# Enable Apache rewrite module
RUN a2enmod rewrite

# Fix permissions
RUN chown -R www-data:www-data /var/www/html

# Expose HTTP port
EXPOSE 80

CMD ["apache2-foreground"]
