<p>List of all channels:</p>            
<table class="table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Key</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($channels as $channels): ?>
            <tr>
                <td><?php echo $channels['name']; ?></td>
                <td><?php echo $channels['privKey']; ?></td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>