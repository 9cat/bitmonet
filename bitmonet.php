<?php
/*
Plugin Name: BitMonet
Plugin URI: http://wordpress.org/plugins/bitmonet/
Description: Microtransactions platform to monetize digital content with nearly zero transaction fees!
Version: 0.1
Author: bitmonet.com
Author URI: http://bitmonet.com
License: GPLv2 or later
Text Domain: bitmonet
*/

if (!defined('ABSPATH')) die();

class BitMonet
{
  // version of the plugin should be updated with header version
  const version = '0.1';

  // language domain, used for translation
  const ld = 'bitmonet';
  const nonce = 'bitmonet-nonce';

  private $_url, $_path, $settings;

  protected $default_settings;

  public function __construct()
  {
    // paths
    $this->_url = plugins_url('', __FILE__);
    $this->_path = dirname(__FILE__);

    // default settings definition, will be used as initial settings
    $this->default_settings = array(
      'homepage_url' => get_site_url(),
      'api_key' => '',
      'company_name' => '',
      'company_logo' => '',
      'number_clicked_need_buy' => '0',
      'article_pass' => 0.1,
      'hour_pass' => 0.15,
      'day_pass' => 0.2,
      'button_color' => '#f7931a',
      'button_text_color' => '#ffffff'
    );

    $this->settings = get_option(__class__.'_settings', $this->default_settings);

    // called to load appropriate language file
    add_action('plugins_loaded', array($this, 'plugins_loaded'));

    // add actions for the admin backend
    if (is_admin())
    {
      add_action('admin_menu', array($this, 'admin_menu'));
      add_action('wp_ajax_'.__class__, array($this, 'ajax_action'));

      // add scripts on the settings page
      add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));

      // alter post add/edit form
      add_action('edit_form_after_title', array($this, 'alter_post_edit_form'));

      // alter post row actions to handle monetize status
      add_filter('post_row_actions', array($this, 'alter_post_row_actions'), 10, 2);
      add_filter('page_row_actions', array($this, 'alter_post_row_actions'), 10, 2);

      // save post data - eg. status of bitmonet for post
      add_action('save_post', array($this, 'save_post'));
    }
    else
    {
      // frontend integration
      if (isset($this->settings['api_key']) && $this->settings['api_key'] &&
        isset($this->settings['homepage_url']) && $this->settings['homepage_url'])
      {
        // add bitmonet script file
        add_action('wp_enqueue_scripts', array($this, 'wp_enqueue_scripts'));

        // add meta tag to the header
        add_action('wp_head', array($this, 'wp_head'));

        // filter requests to catch bitmonet query
        add_filter('request', array($this, 'filter_request'));
      }
    }

    // on activation and uninstallation (this hook must bind to a static method)
    register_activation_hook(__FILE__, array($this, 'activation'));
    register_uninstall_hook(__FILE__, array(__class__, 'uninstall'));
  }

  // on activation
  public function activation()
  {
    add_option(__class__.'_settings', $this->default_settings);
  }

  // on uninstallation
  static function uninstall()
  {
    delete_option(__class__.'_settings');
  }

  // when all plugins are loaded
  public function plugins_loaded()
  {
    load_plugin_textdomain(self::ld, false, dirname(plugin_basename(__FILE__)).'/languages/');
  }

  // add submenu item to the settings menu
  public function admin_menu()
  {
    add_options_page(__('BitMonet', self::ld), __('BitMonet', self::ld), 'manage_options', __class__, array($this, 'settings_page'));
    add_filter('plugin_action_links_'.plugin_basename(__FILE__), array(&$this, 'filter_plugin_actions'), 10, 2);
  }

  // add a shortcut to the settings page on the plugins page
  public function filter_plugin_actions($l, $file)
  {
    $settings_link = '<a href="options-general.php?page='.__class__.'">'.__('Settings').'</a>';
    array_unshift($l, $settings_link);
    return $l;
  }

  // enqueue scripts and styles
  public function admin_enqueue_scripts($hook)
  {
    $screen = get_current_screen();

    if ($hook == 'settings_page_'.__class__)
    {
      add_thickbox();
      wp_enqueue_media();

      // color picker
      wp_enqueue_style(__class__.'_colorpicker', $this->_url.'/3rdparty/jquery-minicolors/jquery.minicolors.css', array(), self::version, 'all');
      wp_enqueue_script(__class__.'_colorpicker', $this->_url.'/3rdparty/jquery-minicolors/jquery.minicolors.min.js', array('jquery'), self::version, false);

      wp_enqueue_style(__class__.'_styles', $this->_url.'/admin/settings.css', array(), self::version, 'all');
      wp_enqueue_script(__class__, $this->_url.'/admin/settings.js', array('jquery'), self::version, false);

      // this is a regular way how to pass variables from PHP to Javascript
      wp_localize_script(__class__, __class__, array(
        'action_url' => admin_url('admin-ajax.php?action='.__class__),
        'text' => array(
          'ajax_error' => __('An error occurred during the AJAX request, please try again later.', self::ld),
          'media_upload_title' => __('Please select company logo', self::ld),
        )
      ));
    }
    else
    if (($hook == 'edit.php' || $hook == 'post-new.php' || $hook == 'post.php') && in_array($screen->post_type, array('page', 'post')))
    {
      wp_enqueue_style(__class__.'_styles', $this->_url.'/admin/postedit.css', array(), self::version, 'all');
      wp_enqueue_script(__class__, $this->_url.'/admin/postedit.js', array('jquery'), self::version, false);
      wp_localize_script(__class__, __class__, array(
        'action_url' => admin_url('admin-ajax.php?action='.__class__),
        'text' => array(
          'monetize_with_bitmonet' => __('Monetize with BitMonet', self::ld)
        )
      ));
    }
  }

  // helper function to get setting if exists and if not then return default
  protected function getSetting($name)
  {
    if (isset($this->settings[$name]) && $this->settings[$name])
      return self::strip(stripslashes($this->settings[$name]));

    return $this->default_settings[$name];
  }

  // page to show settings in the admin backend
  public function settings_page()
  {
    require_once $this->_path.'/admin/settings.php';
  }

  // handle admin ajax actions
  public function ajax_action()
  {
    header('Content-Type: application/json');

    // save settings form
    if (isset($_POST['save_settings_h']))
    {
      // some validation
      $errors = array();

      if (!isset($_POST['homepage_url']) || !$_POST['homepage_url'])
        $errors[] = 'homepage_url';

      if (!isset($_POST['api_key']) || !$_POST['api_key'])
        $errors[] = 'api_key';

      if (!isset($_POST['company_name']) || !$_POST['company_name'])
        $errors[] = 'company_name';

      if (!isset($_POST['article_pass']) || !is_numeric($_POST['article_pass']) || $_POST['article_pass'] < 0.01)
        $errors[] = 'article_pass';

      if (!isset($_POST['hour_pass']) || !is_numeric($_POST['hour_pass']) || $_POST['hour_pass'] < 0.01)
        $errors[] = 'hour_pass';

      if (!isset($_POST['day_pass']) || !is_numeric($_POST['day_pass']) || $_POST['day_pass'] < 0.01)
        $errors[] = 'day_pass';

      if (!isset($_POST['number_clicked_need_buy']) || !is_numeric($_POST['number_clicked_need_buy']) || $_POST['number_clicked_need_buy'] < 0)
        $errors[] = 'number_clicked_need_buy';

      if (!count($errors))
        update_option(__class__.'_settings', $_POST);

      echo json_encode(array('errors' => $errors));
    }

    if (isset($_POST['monetize']) && isset($_POST['post_id']) && $_POST['post_id'])
    {
      print_r($_POST);
      update_post_meta($_POST['post_id'], '_bitmonet', $_POST['monetize']);
      echo json_encode(array('status' => 1));
    }

    exit;
  }

  // filter requests to catch bitmonet query
  public function filter_request($vars)
  {
    // create invoice method
    if (isset($_GET['method']) && $_GET['method'] == 'createInvoice' && isset($_GET['price']) &&
      isset($_GET['currency']) && isset($_GET['callback']))
    {
      $r = wp_remote_post('https://'.$this->getSetting('api_key').'@bitpay.com/api/invoice', array(
        'method' => 'POST',
        'timeout' => 45,
        'redirection' => 5,
        'httpversion' => '1.0',
        'blocking' => true,
        'headers' => array(
          'Content-Type' => 'application/json'
        ),
        'body' => json_encode(array(
          'price' => $_GET['price'],
          'currency' => $_GET['currency'],
          'transactionSpeed' => 'high'
        )),
        'cookies' => array(),
        'sslverify' => false
      ));

      if (!is_wp_error($r))
        echo $_GET['callback'].'('.$r['body'].')';

      exit;
    }

    // check invoice
    if (isset($_GET['method']) && $_GET['method'] == 'checkInvoice' && isset($_GET['id']) && isset($_GET['callback']))
    {
      $r = wp_remote_get('https://'.$this->getSetting('api_key').'@bitpay.com/api/invoice/'.$_GET['id'], array(
        'method' => 'GET',
        'timeout' => 45,
        'redirection' => 5,
        'httpversion' => '1.0',
        'blocking' => true,
        'headers' => array(),
        'body' => false,
        'cookies' => array(),
        'sslverify' => false
      ));

      if (!is_wp_error($r))
        echo $_GET['callback'].'('.$r['body'].')';

      exit;
    }

    return $vars;
  }


  // alter post add/edit form
  public function alter_post_edit_form($post)
  {
    if ($post && in_array($post->post_type, array('post', 'page')))
    {
      $state = get_post_meta($post->ID, '_bitmonet', true);
      echo '<input type="hidden" name="bitmonet_monetize" value="'.$state.'" />';
    }
  }

  // alter post row actions - add info about monetize for listed post
  public function alter_post_row_actions($actions, $post)
  {
    if (in_array($post->post_type, array('post', 'page')))
    {
      $state = get_post_meta($post->ID, '_bitmonet', true);

      $actions = array_merge(array(
        'bitmonet_hidden' => '<input type="hidden" name="bitmonet_monetize" value="'.$state.'" />'
      ), $actions);
    }

    return $actions;
  }

  // save post data - eg. status of bitmonet for saved post
  public function save_post($post_id)
  {
    // perform bulk actions
    if (isset($_GET['bulk_edit']) && isset($_GET['post']) && is_array($_GET['post']))
    {
      foreach($_GET['post'] as $id)
        update_post_meta($id, '_bitmonet', isset($_GET['bitmonet-monetize'])?0:1);
    }

    if (!(in_array($_POST['post_type'], array('post', 'page')) && current_user_can('edit_post', $post_id)))
      return;

    // basically 0 - Enabled (because it's default) and 1 - Disabled
    if (isset($_POST['bitmonet_monetize']))
      update_post_meta($post_id, '_bitmonet', $_POST['bitmonet_monetize']);
  }


  // add scripts to the frontend
  public function wp_enqueue_scripts()
  {
    $article_pass = $this->getSetting('article_pass');
    $hour_pass = $this->getSetting('hour_pass');
    $day_pass = $this->getSetting('day_pass');

    // add bitmonet main script
    wp_enqueue_script(__class__.'_bitmonet', '//cdn.jsdelivr.net/bitmonet/0.1/bitmonet.min.js', array('jquery'), self::version, false);

    if (!is_home()) return;

    $site_url = trailingslashit(get_site_url());

    wp_enqueue_script(__class__, $this->_url.'/bitmonet.js', array('jquery'), self::version, false);
    wp_localize_script(__class__, __class__, array(
      'company' => $this->getSetting('company_name'),
      'logo' => $this->getSetting('company_logo'),
      'numberClickedNeedBuy' => $this->getSetting('number_clicked_need_buy'),
      'bitpayCreatePath' => $site_url.'?method=createInvoice',
      'bitpayCheckPath' => $site_url.'?method=checkInvoice',
      'homeLink' => $this->getSetting('homepage_url'),
      'optionData' => array(
        array(
          'name' => __('Article Pass', self::ld),
          'description' => __('Read just this article', self::ld),
          'price' => $this->convertAmount($article_pass),
          'value' => $article_pass * 100,
          'note' => __('We hope you enjoy your article. Remember not to clear your cookies!', self::ld),
          'class' => 'articlePass'
        ),
        array(
          'name' => __('Hour Pass', self::ld),
          'description' => __('1 hour of unlimited access', self::ld),
          'price' => $this->convertAmount($hour_pass),
          'value' => $hour_pass * 100,
          'note' => __("Please remember not to clear your brower's cookies during this time.", self::ld),
          'class' => 'hourPass'
        ),
        array(
          'name' => __('Day Pass', self::ld),
          'description' => __('All-you-can-read news, all day', self::ld),
          'price' => $this->convertAmount($day_pass),
          'value' => $day_pass * 100,
          'note' => __("Please remember not to clear your brower's cookies during this time.", self::ld),
          'class' => 'dayPass'
        )
      )
    ));
  }

  // add meta tag to the header
  public function wp_head()
  {
    if (!is_home())
    {
      global $post;

      // only if bitmonet is not disabled for this post
      if (!get_post_meta($post->ID, '_bitmonet', true))
        echo '<meta name="bitmonet-article" content="bitmonet-article" bitmonet-articleId="article'.$post->ID.'" />'.PHP_EOL;
    }

    // custom styles for bitmonet dialog
    $button_color = $this->getSetting('button_color');
    $button_text_color = $this->getSetting('button_text_color');

    echo '
    <style>
      .bitmonet-purchaseOption .bitmonet-button.orange {
        background-color: '.$button_color.' !important;
        color: '.$button_text_color.' !important;
      }

      .bitmonet-purchaseOption .bitmonet-button.orange:hover {
        background-color: '.self::setColorBrightness($button_color, 40).' !important;
        color: '.$button_text_color.' !important;
      }
    </style>
    ';
  }


  // convert amount to readable string
  static function convertAmount($amount)
  {
    if ($amount < 1)
      return ($amount * 100).'&cent;';

    return '$'.$amount;
  }

  // alter color brightness
  static function setColorBrightness($hex, $diff)
  {
    $rgb = str_split(trim($hex, '# '), 2);

    foreach ($rgb as &$hex)
    {
      $dec = hexdec($hex);

      if ($diff >= 0)
        $dec += $diff;
      else
        $dec -= abs($diff);

      $dec = max(0, min(255, $dec));
      $hex = str_pad(dechex($dec), 2, '0', STR_PAD_LEFT);
    }

    return '#'.implode($rgb);
  }

  // helper strip function
  static function strip($t)
  {
    return htmlentities($t, ENT_COMPAT, 'UTF-8');
  }
}

new BitMonet();