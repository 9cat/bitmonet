<?php if (!defined('ABSPATH')) die(); ?>

<div class="wrap">
  <div class="settings-area">
    <h2>
      <?php esc_html_e('BitMonet: Microtransactions with Bitcoin', self::ld); ?>
      <span><?php esc_html_e("You'll see a \"Monetize with BitMonet\" option when composing a new post.", self::ld); ?></span>
    </h2>
    <div id="bitmonetform"></div>
    <br />
    <p class="submit">
      <input type="button" class="button button-secondary" name="preview_button" value="<?php esc_attr_e('Preview', self::ld); ?>" />
      <?php submit_button(__('Save Changes', self::ld), 'primary', 'save_settings', false); ?>
      <span class="save_message"><?php _e('Settings were saved.', self::ld); ?></span>
      <span class="spinner"></span>
      <br class="clear" />
    </p>
  </div>
</div>