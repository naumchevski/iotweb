<?php

/**
 * Channel Model.
 *
 * @author naum
 */
class Channel_model extends CI_Model {
    /*
      id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name varchar(128) NOT NULL,
      privKey varchar(128) NOT NULL,
      pubKey varchar(128) NULL,
      createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     */

    public function __construct() {
        $this->load->database();
    }

    public function create_channel($name, $privKey, $pubKey) {
        $data = array(
            'name' => $name,
            'privKey' => $privKey,
            'pubKey' => $pubKey
        );

        return $this->db->insert('channel', $data);
    }

    public function get_channel($c = FALSE) {
        if ($c === FALSE) {
            $query = $this->db->get('channel');
            return $query->result_array();
        }

        $query = $this->db->get_where('channel', array('privKey' => $c));
        return $query->row_array();
    }

}
