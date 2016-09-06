<?php

/**
 * IoT controller.
 *
 * @author naum
 */
class Iot extends CI_Controller {

    public function view($page = 'home') {
        if (!file_exists(APPPATH . '/views/iot/' . $page . '.php')) {
            // Whoops, we don't have a page for that!
            show_404();
        }

        $data['title'] = ucfirst($page); // Capitalize the first letter

        $this->load->view('iot/templates/header', $data);
        $this->load->view('iot/' . $page, $data);
        $this->load->view('iot/templates/footer', $data);
    }

}
