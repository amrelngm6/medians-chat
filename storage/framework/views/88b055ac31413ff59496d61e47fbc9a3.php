<!DOCTYPE html>
<html lang="en">

<?php echo $__env->make('layout.head', ['setting' => $setting], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

<body>

    <!-- Chat Wrapper Starts -->
    <main class="chat-wrapper" id="chat-wrapper" data-scroll-flow="true">
        <section class="chat-container" id="chat-container">
            <div class="chat-area-content">
                <div class="">
                    <!-- Intro Screen Starts -->
                    <?php echo $__env->make('sections.components.intro-screen', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
                    <!-- Intro Screen Ends -->

                    <!-- Chat Window Starts -->
                    <?php echo $__env->make('sections.components.chat-window', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
                    <!-- Chat Window Ends -->
                </div>

                <!-- Chat Input Starts -->
                 <?php echo $__env->make('sections.components.chat-footer', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
                <!-- Chat Input Ends -->
            </div>
        </section>
    </main>
    <!-- Chat Wrapper Ends -->

    <!-- Sections Starts -->
    <div class="sections">

        <?php $__currentLoopData = $content; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $section): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <!-- <?php echo e($key); ?> Section Starts -->
            <?php 
            $sectionName = $key; 
            $triggers = $section['triggers'] ?? '';
            ?>
            <?php if ($__env->exists('sections.index')) echo $__env->make('sections.index', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        <!-- <?php echo e($key); ?> Section Ends -->
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        
    </div>
    <!-- Sections Ends -->

    <!-- Vertical Texts Starts -->
        <?php echo $__env->make('sections.components.vertical_texts', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <!-- Vertical Texts Ends -->
        
    <!-- Footer Starts -->
        <?php echo $__env->make('layout.footer', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <!-- Footer Ends -->
        
</body>
</html><?php /**PATH C:\xampp\htdocs\medians_chat\resources\views/home.blade.php ENDPATH**/ ?>