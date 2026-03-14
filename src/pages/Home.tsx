
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif text-portfolio-blue dark:text-white">
            Welcome to My Website
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8">
            I'm a mathematician and educator sharing my professional experience, research, and personal journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full">
            <Link to="/about">
              <Button className="w-full py-6 text-lg bg-portfolio-blue hover:bg-portfolio-blue/90">
                About Me
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="outline" className="w-full py-6 text-lg">
                View Projects
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
            <Link to="/research" className="group">
              <div className="flex flex-col items-center p-6 border rounded-lg transition-all hover:shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-portfolio-blue dark:text-white">Research</h3>
                <p className="text-muted-foreground text-center mb-4">Explore my academic papers and research work</p>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link to="/blog" className="group">
              <div className="flex flex-col items-center p-6 border rounded-lg transition-all hover:shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-portfolio-blue dark:text-white">Blog</h3>
                <p className="text-muted-foreground text-center mb-4">Read my articles on mathematics and education</p>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link to="/experience" className="group">
              <div className="flex flex-col items-center p-6 border rounded-lg transition-all hover:shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-portfolio-blue dark:text-white">Experience</h3>
                <p className="text-muted-foreground text-center mb-4">Learn about my professional background</p>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
