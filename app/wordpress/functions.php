<?php
add_theme_support('post-thumbnails');
add_theme_support('menus');
add_theme_support('html5');

add_action('get_header', 'remove_admin_bump');

function remove_admin_bump()
{
	remove_action('wp_head', '_admin_bar_bump_cb');
}

function socialMetaTags()
{
    global $post;

    switch($post->post_type)
    {
        case "post":

            $image = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), "large");

            // TWITTER META TAGS
            ?>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@jthawme" />
            <meta name="twitter:title" content="<?php wp_title("&mdash;"); ?>" />
            <meta name="twitter:description" content="<?php echo excerptise($post->post_content,20);?>" />
            <meta name="twitter:image" content="<?php echo $image[0];?>" />
            <meta name="twitter:url" content="<?php echo get_permalink($post->ID);?>" />

            <meta name="og:site_name" content="<?php echo get_bloginfo("name");?>" />
            <meta name="og:image" content="<?php echo $image[0];?>" />
            <meta name="og:title" content="<?php wp_title("&mdash;"); ?>" />
            <meta name="og:description" content="<?php echo excerptise($post->post_content,20);?>" />
            <meta name="og:url" content="<?php echo get_permalink($post->ID);?>" />
            <?php
            break;
        default:
            // TWITTER META TAGS
            ?>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@jthawme" />
            <meta name="twitter:title" content="<?php wp_title("&mdash;"); ?>" />
            <meta name="twitter:description" content="<?php echo strip_tags($post->post_content);?>" />
            <meta name="twitter:url" content="<?php echo get_permalink($post->ID);?>" />

            <meta name="og:site_name" content="<?php echo get_bloginfo("name");?>" />
            <meta name="og:title" content="<?php wp_title("&mdash;"); ?>" />
            <meta name="og:description" content="<?php echo strip_tags($post->post_content);?>" />
            <meta name="og:url" content="<?php echo get_permalink($post->ID);?>" />
            <?php
            break;
    }
}

function excerptise($content, $len = 30)
{
    $words = explode(" ",strip_tags($content));

    if(count($words)>$len)
    {
        $limit = array_slice($words,0,$len);

        return implode(" ",$limit)."...";
    }
    else
    {
        return implode(" ",$words);
    }
}