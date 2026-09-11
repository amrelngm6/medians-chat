<?php 
    $sectionData = $content[$sectionName] ?? [];
    $triggers = $sectionData['triggers'] ?? ($triggers ?? '');
    $flowId = $sectionData['flowId'] ?? ($sectionName === 'greeting' ? 'hello' : $sectionName);
?>

<?php if($sectionName === 'intro'): ?>
    <?php echo $__env->make('sections.components.intro_screen', ['intro' => $sectionData], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
<?php else: ?>
    <div id="flow-<?php echo e($sectionName); ?>" class="generic-flow" data-flow-id="<?php echo e($flowId); ?>" <?php if(!empty($triggers)): ?> data-triggers="<?php echo e($triggers); ?>" <?php endif; ?>>   

        
        <?php if(!empty($sectionData['bio'])): ?>
            <p><?php echo $sectionData['bio']; ?></p>
        <?php elseif(!empty($sectionData['intro']) && is_string($sectionData['intro'])): ?>
            <p class="intro"><?php echo $sectionData['intro']; ?></p>
        <?php endif; ?>

        
        <?php if(!empty($sectionData['blocks'])): ?>
            <?php echo $__env->make('sections.components.blocks', ['blocks' => $sectionData['blocks']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        <?php endif; ?>

        
        <?php if(!empty($sectionData['stats'])): ?>
            <?php echo $__env->make('sections.components.stats', ['stats' => $sectionData['stats']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        <?php endif; ?>

        
        <?php if(!empty($sectionData['categories'])): ?>
            <?php echo $__env->make('sections.components.skills', ['categories' => $sectionData['categories']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        <?php endif; ?>

        
        <?php if(!empty($sectionData['items'])): ?>
            <?php if(isset($sectionData['items'][0]['logoUrl']) || isset($sectionData['items'][0]['logo'])): ?>
                <?php echo $__env->make('sections.components.clients', ['items' => $sectionData['items']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
            <?php else: ?>
                <?php echo $__env->make('sections.components.gallery', ['sectionName' => $sectionName, 'items' => $sectionData['items']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
            <?php endif; ?>
        <?php endif; ?>

        
        <?php if(!empty($sectionData['directContact'])): ?>
            <?php echo $__env->make('sections.components.direct_contact', ['directContact' => $sectionData['directContact']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        <?php endif; ?>

        
        <?php if(!empty($sectionData['socialLinks'])): ?>
            <?php echo $__env->make('sections.components.social_links', ['socialLinks' => $sectionData['socialLinks']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        <?php endif; ?>

        
        <?php if(!empty($sectionData['globalButtons']) || !empty($sectionData['finalButtons'])): ?>
            <div class="project-buttons">
                <?php if(!empty($sectionData['globalButtons'])): ?>
                    <ul class="global">
                        <?php echo $__env->make('sections.components.options_list', ['buttons' => $sectionData['globalButtons']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
                    </ul>
                <?php endif; ?>
                
                <?php if(!empty($sectionData['finalButtons'])): ?>
                    <?php if($sectionName === 'services'): ?>
                        <?php echo $__env->make('sections.components.buttons', ['sectionName' => $sectionName, 'buttons' => $sectionData['finalButtons']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
                    <?php else: ?>
                        <ul class="final">
                            <?php echo $__env->make('sections.components.options_list', ['buttons' => $sectionData['finalButtons']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
                        </ul>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        
        <?php if(!empty($sectionData['buttons']) && empty($sectionData['globalButtons']) && empty($sectionData['finalButtons'])): ?>
            <ul class="options">
                <?php echo $__env->make('sections.components.options_list', ['buttons' => $sectionData['buttons']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
            </ul>
        <?php endif; ?>

    </div>
<?php endif; ?>
<?php /**PATH C:\xampp\htdocs\medians_chat\resources\views/sections/index.blade.php ENDPATH**/ ?>