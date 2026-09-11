<?php if(!empty($directContact)): ?>
<div class="direct-contact">
    <?php $__currentLoopData = $directContact; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $row): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <div class="contact-row" data-label="<?php echo e($row['label'] ?? ''); ?>" data-icon="<?php echo e($row['icon'] ?? ''); ?>"><?php echo e($row['value'] ?? ''); ?></div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</div>
<?php endif; ?>
<?php /**PATH C:\xampp\htdocs\medians_chat\resources\views/sections/components/direct_contact.blade.php ENDPATH**/ ?>