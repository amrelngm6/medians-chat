<?php $__currentLoopData = $blocks ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $block): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <?php if(($block['tag'] ?? 'P') === 'P'): ?>
        <p><?php echo $block['content'] ?? ''; ?></p>
    <?php elseif(($block['tag'] ?? '') === 'UL'): ?>
        <ul>
            <?php $__currentLoopData = $block['items'] ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <li><?php echo $item; ?></li>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </ul>
    <?php elseif(($block['tag'] ?? '') === 'DIV'): ?>
        <div class="<?php echo e($block['className'] ?? 'list-with-icons'); ?>">
            <?php $__currentLoopData = $block['items'] ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <span><?php echo $item; ?></span>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
    <?php endif; ?>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php /**PATH C:\xampp\htdocs\medians_chat\resources\views/sections/components/blocks.blade.php ENDPATH**/ ?>