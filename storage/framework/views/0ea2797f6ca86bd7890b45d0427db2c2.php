<?php $__currentLoopData = $categories ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $category): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
<h2 class="category-skills"><i class="<?php echo e($category['icon'] ?? ''); ?>"></i><?php echo e($category['name'] ?? ''); ?></h2>
<ul class="list-skills">
    <?php $__currentLoopData = $category['skills'] ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $skill): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <li><?php echo e($skill['name'] ?? ''); ?><span class="stars" data-rating="<?php echo e($skill['rating'] ?? 0); ?>"></span></li>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</ul>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php /**PATH C:\xampp\htdocs\medians_chat\resources\views/sections/components/skills.blade.php ENDPATH**/ ?>