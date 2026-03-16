// Figma插件主代码
figma.showUI(__html__, { width: 400, height: 600 });

// 监听来自UI的消息
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-component') {
    try {
      const { imageData, name, description } = msg;

      // 创建图片节点
      const image = figma.createImage(new Uint8Array(imageData));
      const imageNode = figma.createRectangle();
      
      // 计算等比缩放到300x300的尺寸
      const imageSize = await image.getSizeAsync();
      const scale = Math.min(300 / imageSize.width, 300 / imageSize.height);
      const scaledWidth = imageSize.width * scale;
      const scaledHeight = imageSize.height * scale;
      
      // 设置图片节点属性
      imageNode.resize(scaledWidth, scaledHeight);
      imageNode.fills = [{
        type: 'IMAGE',
        scaleMode: 'FILL',
        imageHash: image.hash,
      }];
      
      // 居中图片
      imageNode.x = (300 - scaledWidth) / 2;
      imageNode.y = (300 - scaledHeight) / 2;
      
      // 创建组件容器
      const component = figma.createComponent();
      component.resize(300, 300);
      component.name = name;
      
      // 添加描述到组件的说明
      component.description = description;
      
      // 将图片添加到组件中
      component.appendChild(imageNode);
      
      // 设置组件在画布上的位置
      component.x = figma.viewport.center.x - 150;
      component.y = figma.viewport.center.y - 150;
      
      // 通知UI操作成功
      figma.ui.postMessage({ type: 'success', message: '组件创建成功！' });
    } catch (error) {
      figma.ui.postMessage({ type: 'error', message: '创建组件时出错: ' + error.message });
    }
  } else if (msg.type === 'create-multiple-components') {
    try {
      const { images } = msg;
      
      // 创建所有组件
      const components = [];
      const spacing = 350; // 组件之间的间距
      
      for (let i = 0; i < images.length; i++) {
        const { imageData, name, description } = images[i];
        
        // 创建图片节点
        const image = figma.createImage(new Uint8Array(imageData));
        const imageNode = figma.createRectangle();
        
        // 计算等比缩放到300x300的尺寸
        const imageSize = await image.getSizeAsync();
        const scale = Math.min(300 / imageSize.width, 300 / imageSize.height);
        const scaledWidth = imageSize.width * scale;
        const scaledHeight = imageSize.height * scale;
        
        // 设置图片节点属性
        imageNode.resize(scaledWidth, scaledHeight);
        imageNode.fills = [{
          type: 'IMAGE',
          scaleMode: 'FILL',
          imageHash: image.hash,
        }];
        
        // 居中图片
        imageNode.x = (300 - scaledWidth) / 2;
        imageNode.y = (300 - scaledHeight) / 2;
        
        // 创建组件容器
        const component = figma.createComponent();
        component.resize(300, 300);
        component.name = name;
        
        // 添加描述到组件的说明
        component.description = description;
        
        // 将图片添加到组件中
        component.appendChild(imageNode);
        
        // 设置组件在画布上的位置（水平排列）
        const startX = figma.viewport.center.x - (images.length - 1) * spacing / 2;
        component.x = startX + i * spacing;
        component.y = figma.viewport.center.y - 150;
        
        components.push(component);
      }
      
      // 通知UI操作成功
      figma.ui.postMessage({ type: 'success', message: `成功创建 ${components.length} 个组件！` });
    } catch (error) {
      figma.ui.postMessage({ type: 'error', message: '创建组件时出错: ' + error.message });
    }
  }
};