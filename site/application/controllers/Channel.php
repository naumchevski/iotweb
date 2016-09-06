<?php

/**
 * Channel.
 *
 * @author naum
 */
class Channel extends CI_Controller {

    const CREATEMETHOD = "create";
    const GETMETHOD = "get";
    const SETMETHOD = "set";

    public function __construct() {
        parent::__construct();
        $this->load->model('channel_model');
        $this->load->helper('url_helper');
    }

    public function index() {
        $data['channels'] = $this->channel_model->get_channel();
        $data['title'] = 'Channels';

        $this->load->view('iot/templates/header', $data);
        $this->load->view('channel/index', $data);
        $this->load->view('iot/templates/footer');
    }

    public function create() {
        $name = trim(htmlspecialchars($this->input->post('name')));

        header('Content-Type: application/json');
        if (strlen($name) == 0) {
            header('HTTP/1.1 500 Internal Server Error');
            // return JOSN
            $data = array('error' => 'name not set');
            echo json_encode($data);
            return;
        }
        // create channel
        /* fix this, use json_decode */
        $channel = json_decode($this->doHubAction(self::CREATEMETHOD, ""));
        // save into db
        $this->channel_model->create_channel($name, $channel->priv, $channel->pub);
        // return JOSN
        $data = array(
            'name' => $name,
            'privKey' => $channel->priv,
            'pubKey' => $channel->pub);
        
        echo json_encode($data);
    }

    public function set($c, $value) {
        $couter = $this->doHubAction(self::SETMETHOD, $c . "=" . $value);
        echo $couter;
    }

    public function get($c) {
        $channel = $this->channel_model->get_channel($c);
        $couter = $this->doHubAction(self::GETMETHOD, $c);
        
        // [privKey]
        // return JOSN
        $data = array(
            'name' => $channel['name'],
            'privKey' => $channel['privKey'],
            'pubKey' => $channel['pubKey'],
            'value' => $couter);
        
        header('Content-Type: application/json');
        echo json_encode($data);
    }

    private function doHubAction($method, $cmd) {
        $action = $this->config->item('hub');
        $action = $action . $method . (strlen($cmd) ? "?" . $cmd : "");
        $response = file_get_contents($action);

        return $response;
    }

}
