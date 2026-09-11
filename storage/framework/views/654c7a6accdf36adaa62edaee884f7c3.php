    <div class="projects-data">
        <?php $__currentLoopData = $items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="project-item" data-title="<?php echo e($item['title'] ?? ''); ?>" data-link="<?php echo e($item['link'] ?? ''); ?>" data-image="<?php echo e($item['image'] ?? ''); ?>" data-media="<?php echo e($item['mediaType'] ?? 'image'); ?>" <?php if(!empty($item['youtubeId'])): ?> data-youtube-id="<?php echo e($item['youtubeId']); ?>" <?php endif; ?> <?php if(!empty($item['videoUrl'])): ?> data-video-url="<?php echo e($item['videoUrl']); ?>" <?php endif; ?>>
            <p class="summary"><?php echo e($item['summary'] ?? ''); ?></p>
            <?php if(($item['mediaType'] ?? '') === 'gallery' && !empty($item['gallery'])): ?>
            <div class="gallery-urls service-gallery">
                <?php $__currentLoopData = $item['gallery']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $imgUrl): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <img src="<?php echo e($imgUrl); ?>" alt="">
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
            <?php endif; ?>
        </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div><?php /**PATH C:\xampp\htdocs\medians_chat\resources\views/sections/components/gallery.blade.php ENDPATH**/ ?>