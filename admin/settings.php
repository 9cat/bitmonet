<?php if (!defined('ABSPATH')) die(); ?>

<div class="wrap">
  <div class="settings-area">
    <h2>
      <?php esc_html_e('BitMonet: Microtransactions with Bitcoin', self::ld); ?>
      <span><?php esc_html_e("You'll see a \"Monetize with BitMonet\" option when composing a new post.", self::ld); ?></span>
    </h2>

    <form id="settings_form">
      <input type="hidden" name="save_settings_h" value="1" />

      <h3><?php _e('Connect', self::ld); ?></h3>

      <table class="form-table">
        <tr>
          <th scope="row"><label for="homepage_url"><?php _e('Your Homepage', self::ld); ?></label></th>
          <td>
            <input type="text" class="website" name="homepage_url" id="homepage_url" value="<?php echo $this->getSetting('homepage_url'); ?>" placeholder="www.yourwebsite.com" />
          </td>
        </tr>

        <tr>
          <th scope="row">
            <label for="api_key">
              <?php _e('BitPay API Key', self::ld); ?>
              <span>
                <?php _e('Find yours', self::ld); ?>
                <a href="https://bitpay.com/api-keys" target="_blank"><?php _e('here', self::ld); ?></a>
              </span>
            </label>
          </th>
          <td valign="top">
            <input type="text" class="apikey" name="api_key" id="api_key" value="<?php echo $this->getSetting('api_key'); ?>" />
          </td>
        </tr>
      </table>

      <h3><?php _e('Customize', self::ld); ?></h3>

      <table class="form-table">
        <tr>
          <th scope="row"><label for="company_name"><?php _e('Company', self::ld); ?></label></th>
          <td>
            <input type="text" class="website" name="company_name" id="company_name" value="<?php echo $this->getSetting('company_name'); ?>" />
          </td>
        </tr>

        <tr>
          <th scope="row"><label for="company_logo"><?php _e('Company Logo', self::ld); ?></label></th>
          <td>
            <input type="hidden" name="company_logo" id="company_logo" value="<?php echo $company_logo = $this->getSetting('company_logo'); ?>" />
            <input type="button" class="button button-secondary" name="logo_picker" value="<?php esc_attr_e('Please select', self::ld); ?>" />
            <a class="show_preview thickbox"<?php echo !$company_logo?' style="display: none;"':''; ?> href="<?php echo $company_logo; ?>"><?php _e('Show preview', self::ld); ?></a>
          </td>
        </tr>
      </table>

      <div class="two-panel">
        <div class="float-left">
          <table class="form-table pass-table">
            <tr>
              <th scope="row"><label for="article_pass"><?php _e('Article pass', self::ld); ?></label></th>
              <td>
                <span class="sign">$</span>
                <input type="number" class="pass" name="article_pass" id="article_pass" value="<?php echo $this->getSetting('article_pass'); ?>" min="0.01" step="0.01" />
              </td>
            </tr>

            <tr>
              <th scope="row"><label for="hour_pass"><?php _e('Hour pass', self::ld); ?></label></th>
              <td>
                <span class="sign">$</span>
                <input type="number" class="pass" name="hour_pass" id="hour_pass" value="<?php echo $this->getSetting('hour_pass'); ?>" min="0.01" step="0.01" />
              </td>
            </tr>

            <tr>
              <th scope="row"><label for="day_pass"><?php _e('Day pass', self::ld); ?></label></th>
              <td>
                <span class="sign">$</span>
                <input type="number" class="pass" name="day_pass" id="day_pass" value="<?php echo $this->getSetting('day_pass'); ?>" min="0.01" step="0.01" />
              </td>
            </tr>
          </table>
        </div>

        <div class="float-left">
          <table class="form-table">

            <tr>
              <th scope="row"><label for="number_clicked_need_buy"><?php _e('Free Content Count', self::ld); ?></label></th>
              <td>
                <input type="number" title="<?php esc_attr_e('Number of articles user has to click before the BitMonet dialog box is shown.', self::ld); ?>" class="pass" name="number_clicked_need_buy" id="number_clicked_need_buy" value="<?php echo $this->getSetting('number_clicked_need_buy'); ?>" min="0" step="1" />
              </td>
            </tr>

            <tr>
              <th scope="row"><label for="button_color"><?php _e('Button Color', self::ld); ?></label></th>
              <td>
                <input type="text" name="button_color" class="color-picker" id="button_color" value="<?php echo $this->getSetting('button_color'); ?>" />
              </td>
            </tr>

            <tr>
              <th scope="row"><label for="button_text_color"><?php _e('Button Text Color', self::ld); ?></label></th>
              <td>
                <input type="text" name="button_text_color" class="color-picker" id="button_text_color" value="<?php echo $this->getSetting('button_text_color'); ?>" />
              </td>
            </tr>
          </table>
        </div>

        <br class="clear" />
      </table>

      <br />

      <p class="submit">
        <?php submit_button(__('Save Changes', self::ld), 'primary', 'save_settings', false); ?>
        <span class="save_message"><?php _e('Settings were saved.', self::ld); ?></span>
        <span class="spinner"></span>
        <br class="clear" />
      </p>
    </form>
  </div>
</div>