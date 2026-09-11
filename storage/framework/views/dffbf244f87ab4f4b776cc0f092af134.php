<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo e($setting['general.app_name'] ?? ''); ?> | <?php echo e($setting['seo.site_title'] ?? ''); ?></title>
    <!-- Template Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Unbounded:wght@200..900&display=swap" rel="stylesheet">

    <!-- Template CSS Files -->
    <link href="/assets/css/all.min.css" rel="stylesheet">
    <link href="/assets/css/style.css" rel="stylesheet">

     <!-- Color Switcher - Only Demo -->
     <link rel="stylesheet" type="text/css" href="/assets/css/colorswitcher.css">
     <!-- CSS Skin File -->
     <link id="dynamic-theme" href="/assets/css/skins/<?php echo e($setting['general.theme_color'] ?? 'default'); ?>.css" rel="stylesheet">

     <script>
        window.__CMS_API__ = "/api/v1"; // Replace with your actual CMS API URL
        window.csrf_token = '<?php echo e(csrf_token()); ?>';
     </script>
</head><?php /**PATH C:\xampp\htdocs\medians_chat\resources\views/layout/head.blade.php ENDPATH**/ ?>