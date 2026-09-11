    <!-- Call To Actions Starts -->
    <div id="<?php echo e($sectionName ?? ''); ?>-options-target" class="<?php echo e($sectionName ?? ''); ?>-options">
        <?php $__currentLoopData = $buttons ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $button): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <button class="btn btn-primary <?php echo e($button['styleClass'] ?? false ? $button['styleClass'] : ''); ?>" data-action="<?php echo e($button['action'] ?? ''); ?>" data-flow-id="<?php echo e($sectionName ?? ''); ?>">
            <span class="button-content"><span><?php echo e($button['label'] ?? ''); ?></span></span>
        </button>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>
    <!-- Call To Actions Ends -->
<?php /**PATH C:\xampp\htdocs\medians_chat\resources\views/sections/components/buttons.blade.php ENDPATH**/ ?>