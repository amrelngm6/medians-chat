<div class="client-list">
    <?php $__currentLoopData = $items ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $client): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <div class="client-item" data-name="<?php echo e($client['name'] ?? ''); ?>" data-logo="<?php echo e($client['logoUrl'] ?? ''); ?>"></div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</div>
<?php /**PATH C:\xampp\htdocs\medians_chat\resources\views/sections/components/clients.blade.php ENDPATH**/ ?>