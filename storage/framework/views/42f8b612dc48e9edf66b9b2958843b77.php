<div id="intro-screen" class="hero-intro-screen">
    <div class="intro-content">
        <div class="intro-grid">
            <div class="intro-text-side">
                <!-- Hello Text Starts -->
                <div class="hello"><span><?php echo e($intro['greeting'] ?? ''); ?></span></div>
                <!-- Hello Text Ends -->
                <!-- Intro Texts Starts -->
                <div class="intro-text">
                    <h1><span><?php echo e($intro['name'] ?? ''); ?></span></h1>
                    <h2><?php echo e($intro['title'] ?? ''); ?></h2>
                </div>
                <div class="heroSummary">
                    <p><?php echo e($intro['heroSummaryText'] ?? ''); ?></p>
                    <span><?php echo e($intro['heroSummaryAuthor'] ?? ''); ?></span>
                </div>
            </div>

            <!-- Photo Starts -->
            <div class="image-container">
                <img id="intro-image" src="<?php echo e($intro['imageUrl'] ?? ''); ?>" alt="<?php echo e($intro['imageAlt'] ?? ''); ?>"
                    class="intro-image">
                <div class="animate-bg"></div>
            </div>
            <!-- Photo Ends -->
        </div>

        <!-- Intro Content Starts -->
        <div class="intro-bottom-content">
            <!-- Call To Actions Starts -->
            <div id="intro-options-target" class="intro-options">
                <?php $__currentLoopData = $intro['buttons'] ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $button): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <button class="btn btn-primary <?php echo e($button['styleClass'] ?? false ? $button['styleClass'] : ''); ?>" data-action="<?php echo e($button['action'] ?? ''); ?>">
                    <span class="button-content"><span><?php echo e($button['label'] ?? ''); ?></span></span>
                </button>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
            <!-- Call To Actions Ends -->
        </div>
        <!-- Intro Content Ends -->
    </div>
</div>
<?php /**PATH C:\xampp\htdocs\medians_chat\resources\views/sections/components/intro_screen.blade.php ENDPATH**/ ?>