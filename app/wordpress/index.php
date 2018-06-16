<?php
$templateDir = get_template_directory_uri();
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title><?php wp_title("&mdash;"); ?></title>
    <meta name="description" content="just another react + webpack boilerplate">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="manifest" href="<?php echo $templateDir;?>/dist/manifest.json">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#fff">
    <meta name="application-name" content="<?php echo get_bloginfo("name");?>">
    <link rel="apple-touch-icon" sizes="57x57" href="<?php echo $templateDir;?>/dist/icons/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="<?php echo $templateDir;?>/dist/icons/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="<?php echo $templateDir;?>/dist/icons/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="<?php echo $templateDir;?>/dist/icons/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="<?php echo $templateDir;?>/dist/icons/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="<?php echo $templateDir;?>/dist/icons/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="<?php echo $templateDir;?>/dist/icons/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="<?php echo $templateDir;?>/dist/icons/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $templateDir;?>/dist/icons/apple-touch-icon-180x180.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="<?php echo get_bloginfo("name");?>">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo $templateDir;?>/dist/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo $templateDir;?>/dist/icons/favicon-16x16.png">
    <link rel="shortcut icon" href="<?php echo $templateDir;?>/dist/icons/favicon.ico">
    <link href="<?php echo $templateDir ;?>/dist/static/css/styles.min.css" rel="stylesheet">

    <?php
    wp_head();
    ?>

    <script>
    window.wpValues = {};
    wpValues.templateURL = '<?php echo $templateDir;?>';
    wpValues.siteURL = '<?php echo home_url();?>';
    wpValues.siteName = '<?php echo get_bloginfo("name");?>';
    </script>

    <?php
    socialMetaTags();
    ?>
  </head>
  <body>
    <div id="root"></div>
    <script src="<?php echo $templateDir ;?>/dist/static/js/bundle.js"></script>
  </body>
</html>
