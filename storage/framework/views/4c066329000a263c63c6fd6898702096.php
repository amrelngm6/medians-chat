<?php if(!empty($stats)): ?>
<div class="list-with-icons">
    <?php $__currentLoopData = $stats; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $stat): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <span><i class="<?php echo e($stat['icon'] ?? ''); ?>"></i> <?php echo e($stat['text'] ?? ''); ?></span>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</div>
<?php endif; ?>
<?php /**PATH C:\xampp\htdocs\medians_chat\resources\views/sections/components/stats.blade.php ENDPATH**/ ?>